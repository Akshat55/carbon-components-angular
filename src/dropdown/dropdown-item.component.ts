import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	ElementRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/multi-select/index.js";

/**
 * Adds Angular inputs to the `<cds-dropdown-item>` web component: an option of `cds-dropdown`
 * written as a child instead of passed in `[items]`.
 *
 * ```html
 * <cds-dropdown [(ngModel)]="fruit">
 * 	<cds-dropdown-item value="apple">Apple</cds-dropdown-item>
 * 	<cds-dropdown-item value="pear" [disabled]="true">Pear</cds-dropdown-item>
 * </cds-dropdown>
 * ```
 *
 * The model of a dropdown with child options is the selected option's `value`.
 */
@Component({
	selector: "cds-dropdown-item",
	template: "<ng-content />",
	host: {
		"[value]": "value ?? element.value",
		"[disabled]": "disabled ?? element.disabled",
		"[selected]": "selected ?? element.selected"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DropdownItem {
	@Input() value?: string;
	@Input({ transform: booleanAttribute }) disabled?: boolean;
	/**
	 * Prefer the dropdown's `ngModel` or `value`; this marks the initial selection.
	 */
	@Input({ transform: booleanAttribute }) selected?: boolean;

	protected element = inject(ElementRef).nativeElement;
}

/**
 * Adds Angular inputs to the `<cds-multi-select-item>` web component: an option of
 * `cds-multi-select` written as a child instead of passed in `[items]`.
 *
 * The model of a multi select with child options is the array of selected `value`s.
 */
@Component({
	selector: "cds-multi-select-item",
	template: "<ng-content />",
	host: {
		"[value]": "value ?? element.value",
		"[disabled]": "disabled ?? element.disabled",
		"[selected]": "selected ?? element.selected",
		"[isSelectAll]": "isSelectAll ?? element.isSelectAll"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MultiSelectItem {
	@Input() value?: string;
	@Input({ transform: booleanAttribute }) disabled?: boolean;
	@Input({ transform: booleanAttribute }) selected?: boolean;
	/**
	 * Makes this option select or clear every other option.
	 */
	@Input({ transform: booleanAttribute }) isSelectAll?: boolean;

	protected element = inject(ElementRef).nativeElement;
}
