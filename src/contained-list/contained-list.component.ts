import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/contained-list/index.js";
import { TemplateSlot } from "carbon-components-angular/utils";
import { ContainedListKind, ContainedListSize } from "./contained-list.enums";

/**
 * Wraps the `<cds-contained-list>` web component.
 *
 * [See demo](../../?path=/story/components-contained-list--basic)
 */
@Component({
	selector: "cds-contained-list",
	template: `
		<ng-container cdsSlot="label" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
		<ng-container cdsSlot="action" [cdsSlotTemplate]="action" [cdsSlotContext]="{ $implicit: actionData }" />
		<ng-content />
	`,
	host: {
		"[label]": "isTemplate(label) ? '' : label",
		"[kind]": "kind",
		"[size]": "size",
		"[isInset]": "isInset",
		"[attr.aria-labelledby]": "labelId"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContainedList {
	static count = 0;

	/**
	 * Template rendered in the action slot, with `actionData` as `$implicit`.
	 */
	@Input() action: TemplateRef<any>;
	@Input() actionData: any;
	/**
	 * Inset rulers between items.
	 */
	@Input() isInset = false;
	@Input() kind: ContainedListKind = ContainedListKind.OnPage;
	@Input() label: string | TemplateRef<any>;
	@Input() size: ContainedListSize = ContainedListSize.Large;
	@Input() labelId = `contained-list-${ContainedList.count++}-header`;

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
