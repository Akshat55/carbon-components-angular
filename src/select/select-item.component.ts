import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/select/index.js";

/**
 * An option of `cds-select` (a native `<option>` works too).
 *
 * Adds Angular inputs to the `<cds-select-item>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-select-item",
	template: "<ng-content />",
	host: {
		"[value]": "value ?? element.value",
		"[label]": "label ?? element.label",
		"[disabled]": "disabled ?? element.disabled",
		"[selected]": "selected ?? element.selected"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectItem {
	@Input() value: string;
	/**
	 * Text of the option, when it has no content.
	 */
	@Input() label: string;
	@Input({ transform: booleanAttribute }) disabled: boolean;
	/**
	 * Prefer the select's `ngModel`; this marks the initial selection.
	 */
	@Input({ transform: booleanAttribute }) selected: boolean;

	protected element = inject(ElementRef).nativeElement;
}

/**
 * A group of `cds-select-item`s (a native `<optgroup>` works too).
 *
 * Adds Angular inputs to the `<cds-select-item-group>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-select-item-group",
	template: "<ng-content />",
	host: {
		"[label]": "label ?? element.label",
		"[disabled]": "disabled ?? element.disabled"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectItemGroup {
	@Input() label: string;
	@Input({ transform: booleanAttribute }) disabled: boolean;

	protected element = inject(ElementRef).nativeElement;
}

/**
 * Loading state of a select.
 *
 * Adds Angular inputs to the `<cds-select-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-select-skeleton",
	template: "<ng-content />",
	host: {
		"[hideLabel]": "hideLabel ?? element.hideLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectSkeleton {
	@Input({ transform: booleanAttribute }) hideLabel: boolean;

	protected element = inject(ElementRef).nativeElement;
}
