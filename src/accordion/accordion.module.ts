import { NgModule } from "@angular/core";
import { Accordion } from "./accordion.component";
import { AccordionItem } from "./accordion-item.component";

/**
 * Importing this module (or the standalone components) registers the
 * `cds-accordion` and `cds-accordion-item` web components.
 */
@NgModule({
	imports: [Accordion, AccordionItem],
	exports: [Accordion, AccordionItem]
})
export class AccordionModule {}
