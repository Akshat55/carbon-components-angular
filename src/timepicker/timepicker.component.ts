import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/time-picker/index.js";
import { provideValueAccessor, TemplateContent, TemplateSlot, WebComponentValueAccessor } from "carbon-components-angular/utils";

/**
 * Adds `ngModel` / reactive forms to the `<cds-time-picker>` web component. Project `cds-time-picker-select`s for AM/PM etc.
 *
 *
 * [See demo](../../?path=/story/components-time-picker--basic)
 */
@Component({
	selector: "cds-time-picker",
	template: `
		<ng-container cdsSlot="label-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
		<ng-content />
	`,
	host: {
		"[id]": "id",
		"[value]": "value ?? ''",
		"[labelText]": "isTemplate(label) ? '' : label",
		"[hideLabel]": "hideLabel",
		"[placeholder]": "placeholder",
		"[pattern]": "pattern",
		"[maxLength]": "maxLength",
		"[size]": "size",
		"[disabled]": "disabled",
		"[invalid]": "invalid",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"(input)": "onInput()"
	},
	providers: [provideValueAccessor(() => TimePicker)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimePicker extends WebComponentValueAccessor<string> {
	static timePickerCount = 0;

	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() label: string | TemplateRef<any>;
	@Input() hideLabel = false;
	@Input() placeholder = "hh:mm";
	@Input() pattern = "(1[012]|[0-9]):[0-5][0-9]";
	@Input() id = `timepicker-${TimePicker.timePickerCount++}`;
	@Input() value: string;
	@Input() maxLength = 5;
	@Input() size: "sm" | "md" | "lg" = "md";
	/**
	 * @deprecated use `<cds-time-picker-skeleton>` instead.
	 */
	@Input() skeleton = false;
	/**
	 * @deprecated the web component follows the surrounding theme / layer.
	 */
	@Input() theme: "light" | "dark" = "dark";

	@Output() valueChange: EventEmitter<string> = new EventEmitter();

	protected content = new TemplateContent();

	constructor() {
		super();
		// The web component uses its host's whole `className` as one class token, which throws
		// once the host has several classes (e.g. Angular forms' `ng-untouched ng-pristine`).
		// Host classes mean nothing inside its shadow root, so hide them from it.
		Object.defineProperty(this.element, "className", { get: () => "", configurable: true });
	}

	writeValue(value: string) {
		this.value = value;
		this.changeDetectorRef.markForCheck();
	}

	onInput() {
		this.value = this.element.value;
		this.onChange(this.value);
		this.valueChange.emit(this.value);
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
