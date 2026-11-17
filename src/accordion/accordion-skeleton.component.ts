import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/accordion/index.js";

/**
 * Loading state of an accordion.
 *
 * Adds Angular inputs to the `<cds-accordion-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-accordion-skeleton",
	template: "<ng-content />",
	host: {
		"[count]": "count ?? element.count",
		"[alignment]": "alignment ?? element.alignment",
		"[isFlush]": "isFlush ?? element.isFlush",
		"[open]": "open ?? element.open"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccordionSkeleton {
	/**
	 * Number of items.
	 */
	@Input() count: number;
	/**
	 * Side the chevron is on.
	 */
	@Input() alignment: "start" | "end";
	/**
	 * Removes the side padding.
	 */
	@Input({ transform: booleanAttribute }) isFlush: boolean;
	/**
	 * Shows the first item expanded.
	 */
	@Input({ transform: booleanAttribute }) open: boolean;

	protected element = inject(ElementRef).nativeElement;
}

/**
 * Loading state of an accordion item.
 *
 * Angular class for the `<cds-accordion-item-skeleton>` web component, so templates can use it without
 * `CUSTOM_ELEMENTS_SCHEMA`. Importing it registers the web component.
 */
@Component({
	selector: "cds-accordion-item-skeleton",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccordionItemSkeleton {}
