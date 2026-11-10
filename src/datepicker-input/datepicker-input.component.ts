import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/date-picker/index.js";
import { provideValueAccessor, TemplateContent, TemplateSlot, WebComponentValueAccessor } from "carbon-components-angular/utils";

/**
 * Wraps the `<cds-date-picker-input>` web component. On its own (`type="simple"`) it is a
 * date text input without a calendar; `cds-date-picker` renders its own inputs.
 * Works with `ngModel` / reactive forms (the value is the typed text).
 *
 * [See demo](../../?path=/story/components-date-picker--simple)
 */
@Component({
	selector: "cds-date-picker-input",
	template: `
		<ng-container cdsSlot="label-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
		@if (isTemplate(helperText)) {
			<ng-container cdsSlot="helper-text" [cdsSlotTemplate]="helperText" />
		} @else if (helperText) {
			<span slot="helper-text">{{ helperText }}</span>
		}
		<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="decorator" />
	`,
	host: {
		"[id]": "id",
		"[kind]": "type === 'range' ? 'from' : type",
		"[labelText]": "isTemplate(label) ? '' : label",
		"[placeholder]": "placeholder",
		"[pattern]": "pattern",
		"[value]": "value",
		"[size]": "size",
		"[disabled]": "disabled",
		"[attr.readonly]": "readonly ? '' : null",
		"[invalid]": "invalid",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"[warn]": "warn",
		"[warnText]": "content.render('warnText', warnText)",
		"(input)": "onInput($event)"
	},
	providers: [provideValueAccessor(() => DatePickerInput)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DatePickerInput extends WebComponentValueAccessor<string> {
	static datePickerCount = 0;

	@Input() type: "simple" | "single" | "range" = "simple";
	@Input() id = `datepicker-${DatePickerInput.datePickerCount++}`;
	@Input() label: string | TemplateRef<any>;
	@Input() placeholder = "mm/dd/yyyy";
	@Input() pattern = "^\\d{1,2}/\\d{1,2}/\\d{4}$";
	@Input() readonly = false;
	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;
	@Input() helperText: string | TemplateRef<any>;
	@Input() decorator: TemplateRef<any>;
	@Input() value = "";
	@Input() size: "sm" | "md" | "lg" = "md";
	/**
	 * @deprecated the web component shows the calendar icon for `single` / `range`.
	 */
	@Input() hasIcon = false;
	/**
	 * @deprecated the web component follows the surrounding theme / layer.
	 */
	@Input() theme: "light" | "dark" = "dark";
	/**
	 * @deprecated use `<cds-date-picker-input-skeleton>` instead.
	 */
	@Input() skeleton = false;

	@Output() valueChange: EventEmitter<string> = new EventEmitter();

	protected content = new TemplateContent();

	writeValue(value: string) {
		this.value = value ?? "";
		this.changeDetectorRef.markForCheck();
	}

	onInput(event: Event) {
		this.value = (event.target as HTMLInputElement).value;
		this.onChange(this.value);
		this.valueChange.emit(this.value);
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
