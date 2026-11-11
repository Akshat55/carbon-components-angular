import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/accordion/index.js";
import { observeChildren } from "carbon-components-angular/utils";

/**
 * Adds Angular inputs to the `<cds-accordion>` web component. Importing it registers the web component.
 *
 * The web component passes `size`, `align`, `isFlush` and `disabled` on to its items.
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
		"[alignment]": "align",
		"[size]": "size",
		"[isFlush]": "isFlush",
		"[disabled]": "disabled"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Accordion {
	/**
	 * Sets the alignment of the chevron icon
	 */
	@Input() align: "start" | "end" = "end";
	/**
	 * Sets the size of all accordion items
	 */
	@Input() size: "sm" | "md" | "lg" = "md";
	/**
	 * Removes the side padding. Does not work with `align="start"`.
	 */
	@Input() isFlush = false;
	/**
	 * Disables every item.
	 */
	@Input() disabled = false;

	constructor() {
		// The web component only passes its settings to the items it has when they change;
		// re-apply them to items added later (`@for`, `createComponent`, ...).
		const element = inject(ElementRef).nativeElement;
		observeChildren(element, inject(DestroyRef), () => {
			["size", "alignment", "isFlush", "disabled"].forEach(name => element.requestUpdate?.(name, undefined));
		});
	}
}
