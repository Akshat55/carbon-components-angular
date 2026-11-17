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
 * Adds Angular inputs to the `<cds-accordion>` web component. Importing it registers the web component.
 *
 * The web component passes `size`, `align`, `isFlush` and `disabled` on to its items. Use
 * `<cds-accordion-skeleton>` for a loading state.
 *
 * ```typescript
 * import { Accordion, AccordionItem } from 'carbon-components-angular';
 * ```
 *
 * [See demo](../../?path=/story/components-accordion--basic)
 */
@Component({
	selector: "cds-accordion",
	template: `<ng-content />`,
	host: {
		"[alignment]": "align ?? element.alignment",
		"[size]": "size ?? element.size",
		"[isFlush]": "isFlush ?? element.isFlush",
		"[disabled]": "disabled ?? element.disabled"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Accordion {
	/**
	 * Sets the alignment of the chevron icon. The web component's default is `"end"`.
	 */
	@Input() align?: "start" | "end";
	/**
	 * Sets the size of all accordion items. The web component's default is `"md"`.
	 */
	@Input() size?: "sm" | "md" | "lg";
	/**
	 * Removes the side padding. Does not work with `align="start"`.
	 */
	@Input({ transform: booleanAttribute }) isFlush?: boolean;
	/**
	 * Disables every item.
	 */
	@Input({ transform: booleanAttribute }) disabled?: boolean;

	protected element = inject(ElementRef).nativeElement;
}
