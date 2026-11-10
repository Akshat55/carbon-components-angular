/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsCheckboxDirective
 *
 * Sits directly on <cds-checkbox> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `Checkbox` component
 * @Inputs/@Outputs to web component attributes/events, and implements
 * ControlValueAccessor so `[(ngModel)]` and reactive forms keep working.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [checked] [disabled] [hideLabel] [name] [id] [value] [title]
 *   [helperText] [invalid] [invalidText] [warn] [warnText] [readOnly]
 *   [indeterminate]
 *   (checkedChange) (indeterminateChange)
 *
 * The label is projected through the web component's default slot, so
 * `<cds-checkbox>My label</cds-checkbox>` works unchanged.
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

let checkboxCounter = 0;

@Directive({
	selector: "cds-checkbox, [cdsCheckbox], [ibmCheckbox]",
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CdsCheckboxDirective),
			multi: true
		}
	]
})
export class CdsCheckboxDirective implements OnChanges, ControlValueAccessor {
	/** Whether the checkbox is checked. */
	@Input() checked = false;

	/** Set to `true` to disable the checkbox. */
	@Input() disabled = false;

	/** Visually hide the label (still available to AT). */
	@Input() hideLabel = false;

	/** Form control name. */
	@Input() name: string;

	/** Unique id — forwarded to the web component. */
	@Input() id = `checkbox-${checkboxCounter++}`;

	/** Value submitted with the form. */
	@Input() value: string;

	/** Native `title` attribute. */
	@Input() title = "";

	/** Helper text (string only — TemplateRef not supported by the web component). */
	@Input() helperText: string | TemplateRef<any>;

	/** Invalid state + message. */
	@Input() invalid?: boolean;
	@Input() invalidText: string | TemplateRef<any>;

	/** Warning state + message. */
	@Input() warn?: boolean;
	@Input() warnText: string | TemplateRef<any>;

	/** Read-only state. */
	@Input() readOnly?: boolean;

	/** Indeterminate ("mixed") state. */
	@Input() indeterminate = false;

	/** Emits the new checked state when the user toggles the checkbox. */
	@Output() checkedChange = new EventEmitter<boolean>();

	/** Emits when the indeterminate state resolves to a definite state. */
	@Output() indeterminateChange = new EventEmitter<boolean>();

	private _onChange: (value: boolean) => void = () => { };
	private _onTouched: () => void = () => { };

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("id", this.id);
		if (this.name) {
			el.setAttribute("name", this.name);
		}
		if (this.value !== undefined && this.value !== null) {
			el.setAttribute("value", this.value);
		}
		if (this.title) {
			el.setAttribute("title", this.title);
		}
		if (typeof this.helperText === "string") {
			el.setAttribute("helper-text", this.helperText);
		}
		if (typeof this.invalidText === "string") {
			el.setAttribute("invalid-text", this.invalidText);
		}
		if (typeof this.warnText === "string") {
			el.setAttribute("warn-text", this.warnText);
		}

		this._setBoolAttr("checked", this.checked);
		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("hide-label", this.hideLabel);
		this._setBoolAttr("invalid", !!this.invalid);
		this._setBoolAttr("warn", !!this.warn);
		this._setBoolAttr("readonly", !!this.readOnly);
		this._setBoolAttr("indeterminate", this.indeterminate);
	}

	/** Bridge the web component's change event → Angular outputs + CVA. */
	@HostListener("cds-checkbox-changed", ["$event"])
	onChanged(event: CustomEvent): void {
		const checked = event.detail?.checked ?? (event.target as any)?.checked;
		this.checked = !!checked;

		if (this.indeterminate) {
			this.indeterminate = false;
			this.indeterminateChange.emit(false);
		}

		this.checkedChange.emit(this.checked);
		this._onChange(this.checked);
		this._onTouched();
	}

	// ----------------------------------------------------- ControlValueAccessor
	writeValue(value: boolean): void {
		this.checked = !!value;
		this._setBoolAttr("checked", this.checked);
	}

	registerOnChange(fn: (value: boolean) => void): void {
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
