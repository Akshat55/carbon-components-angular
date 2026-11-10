/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsPasswordInputDirective
 *
 * Sits directly on <cds-password-input> — the web component replacement for
 * the old class-based `PasswordInput` directive (`[cdsPassword]`).
 * Implements ControlValueAccessor so `[(ngModel)]` and reactive forms keep
 * working.
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
	selector: "cds-password-input, [cdsPassword], [ibmPassword]",
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CdsPasswordInputDirective),
			multi: true
		}
	]
})
export class CdsPasswordInputDirective implements OnChanges, ControlValueAccessor {
	/** Input size. */
	@Input() size: "sm" | "md" | "lg" = "md";

	@Input() invalid = false;
	@Input() warn = false;
	@Input() disabled = false;
	@Input() readonly = false;
	@Input() hideLabel = false;

	@Input() label: string;
	@Input() helperText: string;
	@Input() invalidText: string;
	@Input() warnText: string;
	@Input() placeholder: string;

	/** Labels for the show/hide password visibility toggle. */
	@Input() showPasswordLabel: string;
	@Input() hidePasswordLabel: string;

	/** Current value. */
	@Input() value = "";

	/** Emits the current value on every input. */
	@Output() valueChange = new EventEmitter<string>();

	private _onChange: (value: string) => void = () => { };
	private _onTouched: () => void = () => { };

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("size", this.size);
		this._setStrAttr("label", this.label);
		this._setStrAttr("helper-text", this.helperText);
		this._setStrAttr("invalid-text", this.invalidText);
		this._setStrAttr("warn-text", this.warnText);
		this._setStrAttr("placeholder", this.placeholder);
		this._setStrAttr("show-password-label", this.showPasswordLabel);
		this._setStrAttr("hide-password-label", this.hidePasswordLabel);
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
