/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsTimePickerDirective
 *
 * Sits directly on <cds-time-picker> — the web component replacement for
 * the old Angular TimePicker (<cds-timepicker>).
 * Implements ControlValueAccessor so `[(ngModel)]` and reactive forms keep
 * working.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [label]       → label-text attribute (string only)
 *   [placeholder] [pattern] [id] [disabled] [value] [maxLength]
 *   [invalid] [invalidText] [hideLabel] [size]
 *   (valueChange) ← emitted on input
 *
 * Pair with <cds-time-picker-select> children for AM/PM and timezone selects.
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	forwardRef,
	HostListener,
	Input,
	OnChanges,
	Output,
	TemplateRef
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

let timePickerCounter = 0;

@Directive({
	selector: "cds-time-picker, cds-timepicker, [cdsTimePicker], [ibmTimePicker]",
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CdsTimePickerDirective),
			multi: true
		}
	]
})
export class CdsTimePickerDirective implements OnChanges, ControlValueAccessor {
	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;

	/** Label (string only). */
	@Input() label: string | TemplateRef<any>;

	@Input() hideLabel = false;
	@Input() placeholder = "hh:mm";
	@Input() pattern = "(1[012]|[0-9]):[0-5][0-9]";
	@Input() id = `timepicker-${timePickerCounter++}`;
	@Input() disabled = false;
	@Input() value: string;
	@Input() maxLength = 5;
	@Input() size: "sm" | "md" | "lg" = "md";

	/** Emits the current value on every input. */
	@Output() valueChange: EventEmitter<string> = new EventEmitter();

	private _onChange: (value: string) => void = () => { };
	private _onTouched: () => void = () => { };

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("id", this.id);
		el.setAttribute("placeholder", this.placeholder);
		el.setAttribute("pattern", this.pattern);
		el.setAttribute("max-length", String(this.maxLength));
		el.setAttribute("size", this.size);

		if (typeof this.label === "string") {
			el.setAttribute("label-text", this.label);
		}
		if (typeof this.invalidText === "string") {
			el.setAttribute("invalid-text", this.invalidText);
		}
		if (this.value !== undefined && this.value !== null) {
			(el as any).value = this.value;
		}

		this._setBoolAttr("invalid", this.invalid);
		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("hide-label", this.hideLabel);
	}

	@HostListener("input", ["$event"])
	onInput(event: Event): void {
		const value = (event.target as any)?.value ?? "";
		this.value = value;
		this.valueChange.emit(value);
		this._onChange(value);
		this._onTouched();
	}

	// ----------------------------------------------------- ControlValueAccessor
	writeValue(value: string): void {
		this.value = value ?? "";
		(this._el.nativeElement as any).value = this.value;
	}

	registerOnChange(fn: (value: string) => void): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
		this._setBoolAttr("disabled", isDisabled);
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
