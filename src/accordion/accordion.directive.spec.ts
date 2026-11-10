/**
 * Unit tests for CdsAccordionDirective + CdsAccordionItemDirective.
 *
 * Coverage mirrors the original accordion_component_spec.ts so we prove
 * full backwards compatibility, then adds directive-specific cases.
 */
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, TemplateRef, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AccordionModule } from './accordion.module';

// ─────────────────────────── host components for testing

@Component({
  template: `
    <cds-accordion [size]="size" [disabled]="accordionDisabled">
      <cds-accordion-item
        [disabled]="disabled"
        [title]="title"
        [skeleton]="skeleton"
        (selected)="onSelected($event)">
        test-content
      </cds-accordion-item>
    </cds-accordion>
  `,
})
class BasicTestHost {
  disabled = false;
  accordionDisabled = false;
  title = 'Section 1';
  skeleton = false;
  size = 'md';
  lastSelected: any = null;
  onSelected(e: any) { this.lastSelected = e; }
}

@Component({
  template: `
    <cds-accordion>
      <cds-accordion-item [title]="titleTpl" [context]="ctx" (selected)="onSelected($event)">
        template-content
      </cds-accordion-item>
    </cds-accordion>
    <ng-template #titleTpl let-index="index">
      <span class="custom-title">Section {{ index }}</span>
    </ng-template>
  `,
})
class TemplateRefTestHost {
  @ViewChild('titleTpl') titleTpl!: TemplateRef<any>;
  ctx = { index: 42 };
  lastSelected: any = null;
  onSelected(e: any) { this.lastSelected = e; }
}

// ─────────────────────────────────────── test suite

describe('CdsAccordionDirective + CdsAccordionItemDirective', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccordionModule],
      declarations: [BasicTestHost, TemplateRefTestHost],
    }).compileComponents();
  });

  // ── sanity ──────────────────────────────────────────────────────────────

  it('should create the accordion host', () => {
    const f = TestBed.createComponent(BasicTestHost);
    f.detectChanges();
    const accordion = f.debugElement.query(By.css('cds-accordion'));
    expect(accordion).toBeTruthy();
  });

  // ── attribute reflection ─────────────────────────────────────────────────

  it('should reflect [size] onto the cds-accordion element', () => {
    const f = TestBed.createComponent(BasicTestHost);
    f.componentInstance.size = 'lg';
    f.detectChanges();
    const el = f.debugElement.query(By.css('cds-accordion')).nativeElement;
    expect(el.getAttribute('size')).toBe('lg');
  });

  it('should reflect [align] as the alignment attribute', () => {
    const f = TestBed.createComponent(BasicTestHost);
    f.detectChanges();
    // Default is 'end'
    const el = f.debugElement.query(By.css('cds-accordion')).nativeElement;
    expect(el.getAttribute('alignment')).toBe('end');
  });

  it('should set isFlush attribute when [isFlush]=true', () => {
    const f = TestBed.createComponent(BasicTestHost);
    // Patch the host to pass isFlush — accessed via directive
    const accordion = f.debugElement.query(By.css('cds-accordion'));
    const directive = accordion.injector.get(
      // Import at top of file in real test
      require('./accordion.directive').CdsAccordionDirective
    );
    directive.isFlush = true;
    directive.ngOnChanges({ isFlush: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false } });
    f.detectChanges();
    expect(accordion.nativeElement.hasAttribute('isFlush')).toBeTrue();
  });

  // ── disabled cascade ─────────────────────────────────────────────────────

  it('should set disabled attribute on cds-accordion when [disabled]=true', () => {
    const f = TestBed.createComponent(BasicTestHost);
    f.componentInstance.accordionDisabled = true;
    f.detectChanges();
    const el = f.debugElement.query(By.css('cds-accordion')).nativeElement;
    expect(el.hasAttribute('disabled')).toBeTrue();
  });

  it('should cascade disabled to child cds-accordion-item', () => {
    const f = TestBed.createComponent(BasicTestHost);
    f.componentInstance.accordionDisabled = true;
    f.detectChanges();
    const item = f.debugElement.query(By.css('cds-accordion-item')).nativeElement;
    expect(item.hasAttribute('disabled')).toBeTrue();
  });

  it('should remove disabled from child when parent disabled becomes false', () => {
    const f = TestBed.createComponent(BasicTestHost);
    f.componentInstance.accordionDisabled = true;
    f.detectChanges();
    f.componentInstance.accordionDisabled = false;
    f.detectChanges();
    const item = f.debugElement.query(By.css('cds-accordion-item')).nativeElement;
    expect(item.hasAttribute('disabled')).toBeFalse();
  });

  it('should honour item-level disabled even when parent is not disabled', () => {
    const f = TestBed.createComponent(BasicTestHost);
    f.componentInstance.disabled = true;
    f.componentInstance.accordionDisabled = false;
    f.detectChanges();
    const item = f.debugElement.query(By.css('cds-accordion-item')).nativeElement;
    expect(item.hasAttribute('disabled')).toBeTrue();
  });

  // ── string title ─────────────────────────────────────────────────────────

  it('should reflect string [title] as title attribute on cds-accordion-item', () => {
    const f = TestBed.createComponent(BasicTestHost);
    f.componentInstance.title = 'My Section';
    f.detectChanges();
    const item = f.debugElement.query(By.css('cds-accordion-item')).nativeElement;
    expect(item.getAttribute('title')).toBe('My Section');
  });

  // ── event bridging ───────────────────────────────────────────────────────

  it('should emit (selected) when cds-accordion-item-toggled fires', () => {
    const f = TestBed.createComponent(BasicTestHost);
    f.detectChanges();
    const itemEl = f.debugElement.query(By.css('cds-accordion-item')).nativeElement;

    // Simulate the web component dispatching its custom event
    itemEl.dispatchEvent(new CustomEvent('cds-accordion-item-toggled', {
      bubbles: true,
      composed: true,
      detail: { open: true },
    }));
    f.detectChanges();

    expect(f.componentInstance.lastSelected).toBeTruthy();
    expect(f.componentInstance.lastSelected.expanded).toBeTrue();
  });

  // ── skeleton ─────────────────────────────────────────────────────────────

  it('should set skeleton attribute on item when parent [skeleton]=true', () => {
    const f = TestBed.createComponent(BasicTestHost);
    f.componentInstance.skeleton = true;
    f.detectChanges();
    const item = f.debugElement.query(By.css('cds-accordion-item')).nativeElement;
    expect(item.hasAttribute('skeleton')).toBeTrue();
  });

  // ── TemplateRef title ─────────────────────────────────────────────────────

  it('should portal a TemplateRef [title] into the title slot', fakeAsync(() => {
    const f = TestBed.createComponent(TemplateRefTestHost);
    f.detectChanges();
    tick();
    f.detectChanges();

    const itemEl = f.debugElement.query(By.css('cds-accordion-item')).nativeElement;
    // A slotted child with slot="title" should exist in the light DOM
    const slotted = itemEl.querySelector('[slot="title"]');
    expect(slotted).toBeTruthy();
    // The custom title content should be rendered
    expect(slotted.textContent).toContain('42');
  }));

  // ── expanded ─────────────────────────────────────────────────────────────

  it('should set open attribute when [expanded]=true', () => {
    const f = TestBed.createComponent(BasicTestHost);
    const itemDebug = f.debugElement.query(By.css('cds-accordion-item'));
    const directive = itemDebug.injector.get(
      require('./accordion-item.directive').CdsAccordionItemDirective
    );
    directive.expanded = true;
    directive.ngOnChanges({ expanded: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false } });
    f.detectChanges();
    expect(itemDebug.nativeElement.hasAttribute('open')).toBeTrue();
  });
});
