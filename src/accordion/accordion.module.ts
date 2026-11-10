/**
 * Copyright IBM Corp. 2024
 *
 * AccordionModule
 *
 * Drop-in replacement for the old carbon-components-angular AccordionModule.
 *
 * What it does
 * ────────────
 * 1. Registers the Lit web components (`cds-accordion`, `cds-accordion-item`,
 *    `cds-accordion-item-skeleton`, `cds-accordion-skeleton`) via their exported
 *    classes — no auto-registration side-effects leak into the consumer's app.
 * 2. Exports the two Angular directives so consumers can use them in templates
 *    without any schema hacks (`CUSTOM_ELEMENTS_SCHEMA` is NOT needed when the
 *    module is imported, because Angular knows about the selectors via the directives).
 *
 * Migration from carbon-components-angular
 * ─────────────────────────────────────────
 * Before:
 *   import { AccordionModule } from 'carbon-components-angular';
 *
 * After:
 *   import { AccordionModule } from '@carbon/angular'; // or wherever this lib lives
 *
 * Templates need zero changes — the directive selectors match the old component selectors.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Web component classes (tree-shakeable, no side-effect auto-registration) ---
// These imports pull in the class definitions from @carbon/web-components.
// Adjust the import paths to match your actual package structure.
import CDSAccordion from '@carbon/web-components/es/components/accordion/accordion.js';
import CDSAccordionItem from '@carbon/web-components/es/components/accordion/accordion-item.js';
import CDSAccordionItemSkeleton from '@carbon/web-components/es/components/accordion/accordion-item-skeleton.js';
import CDSAccordionSkeleton from '@carbon/web-components/es/components/accordion/accordion-skeleton.js';

// --- Angular directives ---
import { CdsAccordionDirective } from './accordion.directive';
import { CdsAccordionItemDirective } from './accordion-item.directive';
import { SlottedTemplateComponent } from './slotted-template.component';

// Register web components once when the module is first loaded.
// Using a guard so HMR / multiple imports don't throw "already defined" errors.
function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine('cds-accordion', CDSAccordion);
safeDefine('cds-accordion-item', CDSAccordionItem);
safeDefine('cds-accordion-item-skeleton', CDSAccordionItemSkeleton);
safeDefine('cds-accordion-skeleton', CDSAccordionSkeleton);

@NgModule({
	imports: [
		CommonModule,
		// Standalone directives/components — imported, not declared.
		CdsAccordionDirective,
		CdsAccordionItemDirective,
		SlottedTemplateComponent,
	],
	exports: [
		// Re-export so consumers only need to import AccordionModule.
		CdsAccordionDirective,
		CdsAccordionItemDirective,
		SlottedTemplateComponent,
	],
	// Required because cds-* tags are web components that Angular's template
	// compiler doesn't know about as component classes.
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccordionModule { }
