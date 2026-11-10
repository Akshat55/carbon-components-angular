import {
	AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	ContentChildren,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	QueryList
} from "@angular/core";
import "@carbon/web-components/es/components/accordion/index.js";
import { AccordionItem } from "./accordion-item.component";

/**
 * Wraps the `<cds-accordion>` web component. Importing it registers the web component.
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
		"[isFlush]": "isFlush"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Accordion implements AfterContentInit {
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

	@ContentChildren(AccordionItem) children: QueryList<AccordionItem>;

	protected _skeleton = false;
	protected _disabled = false;

	/**
	 * Sets `skeleton` on every item.
	 */
	@Input() set skeleton(value: boolean) {
		this._skeleton = value;
		this.updateChildren();
	}

	get skeleton(): boolean {
		return this._skeleton;
	}

	/**
	 * When `true`, all items are disabled and collapsed regardless of their own `disabled` input.
	 * When `false`, each item uses its own `disabled` input again.
	 */
	@Input() set disabled(value: boolean) {
		this._disabled = value;
		this.updateChildren();
	}

	get disabled(): boolean {
		return this._disabled;
	}

	ngAfterContentInit() {
		this.updateChildren();
		this.children.changes.subscribe(() => this.updateChildren());
	}

	protected updateChildren() {
		this.children?.forEach(child => {
			child.skeleton = this.skeleton;
			child.setParentDisabled(this.disabled);
			if (this.disabled) {
				child.expanded = false;
			}
		});
	}
}
