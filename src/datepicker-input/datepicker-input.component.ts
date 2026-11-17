import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/date-picker/index.js";
import { provideValueAccessor, TemplateContent, TemplateSlot, WebComponentValueAccessor } from "carbon-components-angular/utils";

/**
 * Adds Angular inputs and outputs to the `<cds-date-picker-input>` web component. On its own (`type="simple"`) it is a
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
		"[kind]": "kind ?? (type === 'range' ? 'from' : type) ?? element.kind",
		"[labelText]": "isTemplate(label) ? '' : (label ?? element.labelText)",
		"[placeholder]": "placeholder ?? element.placeholder",
		"[pattern]": "pattern ?? element.pattern",
		"[value]": "value ?? element.value",
		"[size]": "size ?? element.size",
		"[disabled]": "disabled ?? element.disabled",
		"[invalid]": "invalid ?? element.invalid",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"[warn]": "warn ?? element.warn",
		"[warnText]": "content.render('warnText', warnText)",
		"(input)": "onInput($event)"
	},
	providers: [provideValueAccessor(() => DatePickerInput)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DatePickerInput extends WebComponentValueAccessor<string> implements OnChanges {
	static datePickerCount = 0;

	/**
	 * v6 name for `kind`: `"range"` is the start input (`kind="from"`).
	 */
	@Input() type?: "simple" | "single" | "range";
	/**
	 * The web component's `kind`; inside a range `cds-date-picker`, use `"from"` and `"to"`.
	 * The web component's default is `"simple"`.
	 */
	@Input() kind?: "simple" | "single" | "from" | "to";
	@Input() id = `datepicker-${DatePickerInput.datePickerCount++}`;
	@Input() label: string | TemplateRef<any>;
	@Input() placeholder?: string;
	/**
	 * The web component's default matches `mm/dd/yyyy`.
	 */
	@Input() pattern?: string;
	/**
	 * A `cds-date-picker` sets it on its inputs.
	 */
	@Input({ transform: booleanAttribute }) readonly?: boolean;
	@Input({ transform: booleanAttribute }) invalid?: boolean;
	@Input() invalidText: string | TemplateRef<any>;
	@Input({ transform: booleanAttribute }) warn?: boolean;
	@Input() warnText: string | TemplateRef<any>;
	@Input() helperText: string | TemplateRef<any>;
	@Input() decorator: TemplateRef<any>;
	/**
	 * A `cds-date-picker` sets it on its inputs.
	 */
	@Input() value?: string;
	/**
	 * The web component's default is `"md"`.
	 */
	@Input() size?: "sm" | "md" | "lg";
	/**
	 * @deprecated the web component shows the calendar icon for `single` / `range`.
	 */
	@Input({ transform: booleanAttribute }) hasIcon = false;
	/**
	 * @deprecated the web component follows the surrounding theme / layer.
	 */
	@Input() theme: "light" | "dark" = "dark";
	/**
	 * @deprecated use `<cds-date-picker-input-skeleton>` instead.
	 */
	@Input({ transform: booleanAttribute }) skeleton = false;

	@Output() valueChange: EventEmitter<string> = new EventEmitter();

	protected content = new TemplateContent();

	ngOnChanges(changes: SimpleChanges) {
		// Angular would bind `[readonly]` to the `readOnly` DOM property; the web component's is `readonly`.
		if (changes["readonly"] && this.readonly !== undefined) {
			this.element.readonly = this.readonly;
		}
	}

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
