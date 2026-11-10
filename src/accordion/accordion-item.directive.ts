/**
 * Copyright IBM Corp. 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Directive: CdsAccordionItemDirective
 *
 * Sits directly on <cds-accordion-item> — no wrapper element, no extra DOM node.
 *
 * Key responsibilities
 * ───────────────────
 * 1. Translate Angular @Inputs (title, expanded, disabled, skeleton, context)
 *    to web component attributes / properties.
 * 2. Listen to the web component's custom events (`cds-accordion-item-toggled`,
 *    `cds-accordion-item-beingtoggled`) and re-emit them as Angular @Outputs
 *    (`selected`, `beforeToggle`) — preserving the old carbon-components-angular API.
 * 3. Support `[title]` as either a plain string OR an `ng-template` ref.
 *    When a TemplateRef is passed the directive renders it into a portal that
 *    targets the web component's `title` slot.
 * 4. Expose `setParentDisabled()` so the parent CdsAccordionDirective can
 *    cascade disabled state without stomping the item's own `[disabled]` binding.
 *
 * Backwards-compatible API surface (matches carbon-components-angular AccordionItem):
 *   [title]       string | TemplateRef
 *   [context]     TemplateRef outlet context object
 *   [expanded]    boolean  (two-way via (expandedChange) if needed)
 *   [disabled]    boolean
 *   [skeleton]    boolean
 *   (selected)    EventEmitter<{ id: string; expanded: boolean }>
 *   (beforeToggle) EventEmitter<CustomEvent>
 */
import {
	ApplicationRef,
	ComponentRef,
	Directive,
	ElementRef,
	EmbeddedViewRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { SlottedTemplateComponent } from './slotted-template.component';

let itemCounter = 0;

@Directive({
	// Matches the web component tag directly — zero extra DOM nodes.
	selector: 'cds-accordion-item, [cdsAccordionItem]',
	standalone: true,
})
export class CdsAccordionItemDirective implements OnInit, OnChanges, OnDestroy {

	// ------------------------------------------------------------------ inputs

	/**
	 * The accordion item title.
	 * Accepts a plain string (rendered via the web component's `title` attribute)
	 * or an Angular TemplateRef (portalled into the `title` slot).
	 */
	@Input() title: string | TemplateRef<any> = '';

	/**
	 * Template outlet context passed to a TemplateRef title.
	 * Matches the old `[context]` @Input on AccordionItem.
	 */
	@Input() context: object | null = null;

	/** Unique id — forwarded to the web component. Auto-generated if omitted. */
	@Input() id = `accordion-item-${itemCounter++}`;

	/**
	 * Whether the item is expanded.
	 * Implemented as a setter so parent-directive cascades (which assign the
	 * property directly, bypassing ngOnChanges) still sync the attribute.
	 */
	@Input() set expanded(value: boolean) {
		this._expanded = value;
		this._syncAttributes();
	}
	get expanded(): boolean {
		return this._expanded;
	}

	/** Whether this individual item is disabled. */
	@Input() disabled = false;

	/**
	 * Skeleton loading state. Set by the parent directive or directly —
	 * setter for the same cascade reason as `expanded`.
	 */
	@Input() set skeleton(value: boolean) {
		this._skeleton = value;
		this._syncAttributes();
	}
	get skeleton(): boolean {
		return this._skeleton;
	}

	// ----------------------------------------------------------------- outputs

	/**
	 * Emits after the item is toggled.
	 * Preserves the old `(selected)` event shape: `{ id: string, expanded: boolean }`.
	 */
	@Output() selected = new EventEmitter<{ id: string; expanded: boolean }>();

	/**
	 * Emits before the item is toggled.
	 * Forwards the web component's `cds-accordion-item-beingtoggled` CustomEvent.
	 */
	@Output() beforeToggle = new EventEmitter<CustomEvent>();

	// ---------------------------------------------------------- internal state
	private _parentDisabled = false;
	private _expanded = false;
	private _skeleton = false;
	private _templatePortal: ComponentRef<SlottedTemplateComponent> | null = null;

	constructor(
		private _el: ElementRef<HTMLElement>,
		private _vcr: ViewContainerRef,
		private _appRef: ApplicationRef,
	) { }

	// ------------------------------------------------------------ lifecycle

	ngOnInit(): void {
		this._syncAttributes();
		this._renderTitleSlot();
	}

	ngOnChanges(changes: SimpleChanges): void {
		this._syncAttributes();

		if (changes['title']) {
			this._renderTitleSlot();
		}
	}

	ngOnDestroy(): void {
		this._destroyPortal();
	}

	// ----------------------------------------------------- host event listeners

	/**
	 * Bridge the web component's toggle event → Angular `(selected)` output.
	 * This preserves the exact same event shape as the old Angular AccordionItem.
	 */
	@HostListener('cds-accordion-item-toggled', ['$event'])
	onToggled(event: CustomEvent): void {
		this.expanded = event.detail?.open ?? !this.expanded;
		this.selected.emit({ id: this.id, expanded: this.expanded });
	}

	/**
	 * Bridge the web component's before-toggle event → Angular `(beforeToggle)` output.
	 * The raw CustomEvent is forwarded so callers can call event.preventDefault()
	 * to cancel the toggle, exactly as the web component supports.
	 */
	@HostListener('cds-accordion-item-beingtoggled', ['$event'])
	onBeforeToggled(event: CustomEvent): void {
		this.beforeToggle.emit(event);
	}

	// ---------------------------------------------------- public API for parent

	/**
	 * Called by CdsAccordionDirective to cascade disabled state from the parent
	 * without overwriting this item's own `[disabled]` binding.
	 * Mirrors the old `setParentDisabled()` method on AccordionItem.
	 */
	setParentDisabled(value: boolean): void {
		this._parentDisabled = value;
		this._syncAttributes();
	}

	// ------------------------------------------------------ private helpers

	/**
	 * Writes Angular input values to the web component as attributes/properties.
	 * Boolean attributes are set/removed (not set to the string "false").
	 */
	private _syncAttributes(): void {
		const el = this._el.nativeElement;

		// String title goes directly as attribute; TemplateRef handled via slot portal.
		if (typeof this.title === 'string') {
			el.setAttribute('title', this.title);
		}

		// Effective disabled = own disabled OR parent-cascaded disabled.
		this._setBoolAttr('disabled', this.disabled || this._parentDisabled);
		this._setBoolAttr('open', this.expanded);
		this._setBoolAttr('skeleton', this.skeleton);
	}

	/**
	 * Handles `[title]` as an Angular TemplateRef.
	 *
	 * The web component exposes a `title` slot. We render the TemplateRef into a
	 * lightweight component (`SlottedTemplateComponent`) and append it as a child
	 * of the web component with `slot="title"`, so it flows into the shadow DOM
	 * slot — no wrapper element, no style leakage.
	 *
	 * When the title is a plain string we destroy any existing portal and fall
	 * back to the `title` attribute (handled in _syncAttributes).
	 */
	private _renderTitleSlot(): void {
		if (!(this.title instanceof TemplateRef)) {
			this._destroyPortal();
			return;
		}

		// Create or reuse the portal component. The ViewContainerRef attaches
		// the view itself — attaching it to ApplicationRef too throws NG0902.
		if (!this._templatePortal) {
			this._templatePortal = this._vcr.createComponent(SlottedTemplateComponent);

			// The portal host element needs slot="title" so the web component routes it correctly.
			const portalEl = (this._templatePortal.hostView as EmbeddedViewRef<any>)
				.rootNodes[0] as HTMLElement;
			portalEl.setAttribute('slot', 'title');

			// Append into the web component's light DOM — not shadow DOM.
			this._el.nativeElement.appendChild(portalEl);
		}

		// Always update template + context so change detection works correctly.
		this._templatePortal.instance.template = this.title;
		this._templatePortal.instance.context = this.context ?? {};
		this._templatePortal.changeDetectorRef.detectChanges();
	}

	private _destroyPortal(): void {
		if (this._templatePortal) {
			// destroy() detaches the view from its ViewContainerRef itself.
			this._templatePortal.destroy();
			this._templatePortal = null;
		}
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, '');
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
