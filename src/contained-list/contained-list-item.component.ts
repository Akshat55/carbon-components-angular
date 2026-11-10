import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/contained-list/index.js";
import { IconDirective } from "carbon-components-angular/icon";
import { TemplateSlot } from "carbon-components-angular/utils";

/**
 * Wraps the `<cds-contained-list-item>` web component. Listen to clicks on `clickable` items with `(click)`.
 *
 * [See demo](../../?path=/story/components-contained-list--basic)
 */
@Component({
	selector: "cds-contained-list-item",
	template: `
		@if (isTemplate(icon)) {
			<ng-container cdsSlot="icon" [cdsSlotTemplate]="icon" />
		} @else if (icon) {
			<svg [cdsIcon]="icon" size="16" slot="icon"></svg>
		}
		<ng-content />
		<ng-container cdsSlot="action" [cdsSlotTemplate]="action" [cdsSlotContext]="{ $implicit: actionData }" />
	`,
	host: {
		"[clickable]": "clickable",
		"[disabled]": "disabled",
		"role": "listitem"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IconDirective, TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContainedListItem {
	/**
	 * Template rendered in the action slot, with `actionData` as `$implicit`.
	 */
	@Input() action: TemplateRef<any>;
	@Input() actionData: any;
	@Input() disabled = false;
	/**
	 * Renders the item as a button.
	 */
	@Input() clickable: boolean;
	/**
	 * Icon name (for `cdsIcon`) or a template.
	 */
	@Input() icon: TemplateRef<any> | string;

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
