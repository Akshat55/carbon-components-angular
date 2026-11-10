/**
 * Copyright IBM Corp. 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Directive: CdsAccordionDirective
 *
 * Sits directly on <cds-accordion> — no wrapper element, no extra DOM node.
 * Translates Angular-friendly @Inputs to web component attributes/properties
 * and queries child CdsAccordionItemDirective instances to cascade disabled state,
 * mirroring the behaviour of the old Angular Accordion component without any wrapping.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [align]      → alignment attribute  ('start' | 'end',  default: 'end')
 *   [size]       → size attribute       ('sm' | 'md' | 'lg', default: 'md')
 *   [isFlush]    → isFlush attribute    (boolean, default: false)
 *   [disabled]   → disabled attribute   (boolean, cascades to items)
 *   [skeleton]   → skeleton input       (cascades to items)
 */
import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { CdsAccordionItemDirective } from './accordion-item.directive';
import { ACCORDION_ALIGNMENT, ACCORDION_SIZE } from './defs';

@Directive({
  // Matches the web component tag — no extra element in the DOM.
  // The `cdsAccordion` attribute form is also supported for explicit opt-in.
  selector: 'cds-accordion, [cdsAccordion]',
  standalone: true,
})
export class CdsAccordionDirective implements OnChanges, AfterContentInit, OnDestroy {

  // ------------------------------------------------------------------ inputs
  // Keep the same @Input() names as the old Angular component so existing
  // templates need zero changes.

  /**
   * Alignment of the chevron / heading.
   * Maps to the `alignment` attribute on <cds-accordion>.
   * Old API used `align`; we accept both for backwards compatibility.
   */
  @Input() align: 'start' | 'end' = 'end';

  /** @deprecated use `align`. Kept for full backwards compatibility. */
  @Input() alignment: ACCORDION_ALIGNMENT = ACCORDION_ALIGNMENT.END;

  /** Size cascaded to all child accordion items. */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Flush mode — no left/right padding on content.
   * Does not work with align="start".
   */
  @Input() isFlush = false;

  /**
   * Disables the entire accordion and cascades to all child items.
   * Mirrors the old `disabled` @Input on the Angular Accordion component.
   */
  @Input() disabled = false;

  /**
   * Skeleton state cascaded to all child items.
   * Mirrors the old `skeleton` @Input on the Angular Accordion component.
   */
  @Input() skeleton = false;

  // --------------------------------------------------------- child queries
  @ContentChildren(CdsAccordionItemDirective, { descendants: true })
  private _items!: QueryList<CdsAccordionItemDirective>;

  private _sub = new Subscription();

  constructor(private _el: ElementRef<HTMLElement>) {}

  // --------------------------------------------------------- lifecycle
  ngOnChanges(changes: SimpleChanges): void {
    // Reflect Angular inputs onto the web component's observed attributes.
    this._syncAttributes();
    // Re-cascade to children when parent-level state changes.
    if (changes['disabled'] || changes['skeleton']) {
      this._cascadeToChildren();
    }
    // Turning the parent's skeleton off resets the children it enabled.
    if (changes['skeleton'] && !changes['skeleton'].firstChange && !this.skeleton) {
      this._items?.forEach((item) => (item.skeleton = false));
    }
  }

  ngAfterContentInit(): void {
    // Re-cascade whenever the projected child list changes (items added/removed).
    this._sub.add(
      this._items.changes.pipe(startWith(this._items)).subscribe(() => {
        this._cascadeToChildren();
      })
    );
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

  // ------------------------------------------------------- private helpers

  /**
   * Writes Angular input values to the underlying web component as attributes.
   * The web component observes these attributes and handles its own rendering.
   */
  private _syncAttributes(): void {
    const el = this._el.nativeElement;

    // `align` wins; fall back to the deprecated `alignment` input.
    const resolvedAlign = this.align ?? (this.alignment === ACCORDION_ALIGNMENT.START ? 'start' : 'end');
    el.setAttribute('alignment', resolvedAlign);

    el.setAttribute('size', this.size);

    // Boolean attributes: set or remove (don't set to "false").
    this._setBoolAttr('isFlush', this.isFlush);
    this._setBoolAttr('disabled', this.disabled);
  }

  /**
   * Pushes `disabled` and `skeleton` down to each child directive,
   * exactly as the old AccordionComponent.updateChildren() did.
   */
  private _cascadeToChildren(): void {
    if (!this._items) return;
    this._items.forEach((item) => {
      // Only overwrite the item's own [skeleton] binding when the parent
      // explicitly enables skeleton state.
      if (this.skeleton) {
        item.skeleton = true;
      }
      item.setParentDisabled(this.disabled);
      // Collapse items when parent is disabled, matching old behaviour.
      if (this.disabled) {
        item.expanded = false;
      }
    });
  }

  private _setBoolAttr(name: string, value: boolean): void {
    if (value) {
      this._el.nativeElement.setAttribute(name, '');
    } else {
      this._el.nativeElement.removeAttribute(name);
    }
  }
}
