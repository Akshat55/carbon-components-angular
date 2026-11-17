import { NgModule } from "@angular/core";
import { Accordion } from "./accordion.component";
import { AccordionItem } from "./accordion-item.component";
import { AccordionSkeleton, AccordionItemSkeleton } from "./accordion-skeleton.component";

/**
 * Importing this module (or the standalone components) registers the
 * `cds-accordion` and `cds-accordion-item` web components.
 */
@NgModule({
	imports: [Accordion, AccordionItem, AccordionSkeleton, AccordionItemSkeleton],
	exports: [Accordion, AccordionItem, AccordionSkeleton, AccordionItemSkeleton]
})
export class AccordionModule {}
