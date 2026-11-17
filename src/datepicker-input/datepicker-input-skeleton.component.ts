import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/date-picker/index.js";

/**
 * Loading state of a date picker input.
 *
 * Adds Angular inputs to the `<cds-date-picker-input-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-date-picker-input-skeleton",
	template: "<ng-content />",
	host: {
		"[hideLabel]": "hideLabel ?? element.hideLabel",
		"[kind]": "kind ?? element.kind",
		"[range]": "range ?? element.range"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DatePickerInputSkeleton {
	@Input({ transform: booleanAttribute }) hideLabel: boolean;
	@Input() kind: "simple" | "single" | "from" | "to";
	/**
	 * Renders two inputs.
	 */
	@Input({ transform: booleanAttribute }) range: boolean;

	protected element = inject(ElementRef).nativeElement;
}
