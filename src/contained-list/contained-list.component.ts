import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	TemplateRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/contained-list/index.js";
import { TemplateSlot } from "carbon-components-angular/utils";
import { ContainedListKind, ContainedListSize } from "./contained-list.enums";

/**
 * Adds Angular inputs and outputs to the `<cds-contained-list>` web component.
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
		"[label]": "isTemplate(label) ? '' : (label ?? element.label)",
		"[kind]": "kind ?? element.kind",
		"[size]": "size ?? element.size",
		"[isInset]": "isInset ?? element.isInset",
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
	@Input({ transform: booleanAttribute }) isInset?: boolean;
	/**
	 * The web component's default is `"on-page"`.
	 */
	@Input() kind?: ContainedListKind;
	@Input() label: string | TemplateRef<any>;
	/**
	 * Unset, the list follows the surrounding layout size (v6 defaulted to `"lg"`).
	 */
	@Input() size?: ContainedListSize;
	@Input() labelId = `contained-list-${ContainedList.count++}-header`;

	protected element = inject(ElementRef).nativeElement;

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
