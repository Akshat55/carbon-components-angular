/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsTextareaDirective
 *
 * Sits directly on <cds-textarea> — the web component replacement for the
 * old class-based `TextArea` directive (`[cdsTextArea]` on a native
 * <textarea>). Implements ControlValueAccessor so `[(ngModel)]` and reactive
 * forms keep working.
 *
 * Backwards-compatible API surface:
 *   [invalid] [warn] [disabled] [readonly]
 *   plus the label texts that previously lived on the `cds-label` wrapper:
 *   [label] [helperText] [invalidText] [warnText] [placeholder] [hideLabel]
 *   [rows] [cols]
 *   (valueChange) — emits the current value on input
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	forwardRef,
	HostListener,
	Input,
	OnChanges,
	Output
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
	selector: "cds-textarea, [cdsTextArea], [ibmTextArea]",
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CdsTextareaDirective),
			multi: true
		}
	]
})
export class CdsTextareaDirective implements OnChanges, ControlValueAccessor {
	@Input() invalid = false;
	@Input() warn = false;
	@Input() disabled = false;
	@Input() readonly = false;
	@Input() hideLabel = false;

	/** Label rendered by the web component (replaces the cds-label wrapper). */
	@Input() label: string;
	@Input() helperText: string;
	@Input() invalidText: string;
	@Input() warnText: string;
	@Input() placeholder: string;

	/** Native rows/cols. */
	@Input() rows: number;
	@Input() cols: number;

	/** Current value. */
	@Input() value = "";

	/** Emits the current value on every input. */
	@Output() valueChange = new EventEmitter<string>();

	private _onChange: (value: string) => void = () => { };
	private _onTouched: () => void = () => { };

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		this._setStrAttr("label", this.label);
		this._setStrAttr("helper-text", this.helperText);
		this._setStrAttr("invalid-text", this.invalidText);
		this._setStrAttr("warn-text", this.warnText);
		this._setStrAttr("placeholder", this.placeholder);
		if (this.rows) {
			el.setAttribute("rows", String(this.rows));
		}
		if (this.cols) {
			el.setAttribute("cols", String(this.cols));
		}
		(el as any).value = this.value;

		this._setBoolAttr("invalid", this.invalid);
		this._setBoolAttr("warn", this.warn);
		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("readonly", this.readonly);
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

	private _setStrAttr(name: string, value: string | undefined): void {
		if (value !== undefined && value !== null) {
			this._el.nativeElement.setAttribute(name, value);
		}
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
