import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/combo-box/index.js";

/**
 * Adds Angular inputs to the `<cds-combo-box-item>` web component: an option of `cds-combo-box`
 * written as a child instead of passed in `[items]`.
 *
 * ```html
 * <cds-combo-box [(ngModel)]="fruit">
 * 	<cds-combo-box-item value="apple">Apple</cds-combo-box-item>
 * 	<cds-combo-box-item value="pear">Pear</cds-combo-box-item>
 * </cds-combo-box>
 * ```
 *
 * The model of a combo box with child options is the selected option's `value`.
 */
@Component({
	selector: "cds-combo-box-item",
	template: "<ng-content />",
	host: {
		"[value]": "value ?? element.value",
		"[disabled]": "disabled ?? element.disabled",
		"[selected]": "selected ?? element.selected"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComboBoxItem {
	@Input() value?: string;
	@Input({ transform: booleanAttribute }) disabled?: boolean;
	/**
	 * The combo box sets it itself when the user selects the item.
	 */
	@Input({ transform: booleanAttribute }) selected?: boolean;

	protected element = inject(ElementRef).nativeElement;
}
