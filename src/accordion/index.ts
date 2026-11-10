/**
 * Public API surface for the Angular accordion layer.
 *
 * Consumers import from this barrel:
 *   import { AccordionModule, CdsAccordionDirective, CdsAccordionItemDirective } from '@carbon/angular/accordion';
 */

// Module (registers web components + exports directives)
export { AccordionModule } from './accordion.module';

// Directives (for standalone component consumers)
export { CdsAccordionDirective } from './accordion.directive';
export { CdsAccordionItemDirective } from './accordion-item.directive';

// Helper (rarely needed directly, but exported for extensibility)
export { SlottedTemplateComponent } from './slotted-template.component';

// Enums re-exported from the Lit library — one source of truth
export { ACCORDION_SIZE, ACCORDION_ALIGNMENT, ACCORDION_ITEM_BREAKPOINT } from './defs';
