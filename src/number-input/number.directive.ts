/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsNumberInputDirective
 *
 * Sits directly on <cds-number-input> — the web component replacement for
 * the old Angular `NumberComponent` (<cds-number>).
 * Implements ControlValueAccessor so `[(ngModel)]` and reactive forms keep
 * working.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [value] [min] [max] [step] [disabled] [invalid] [warn] [readonly]
 *   [size] [required] [placeholder] [hideLabel] [hideSteppers] [id]
 *   [label]       → label attribute (string only)
 *   [helperText]  → helper-text attribute (string only)
 *   [invalidText] → invalid-text attribute (string only)
 *   [warnText]    → warn-text attribute (string only)
 *   (change)      ← bridged from the `cds-number-input` event, emits NumberChange
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

/**
 * Used to emit changes performed on the number input.
 */
export class NumberChange {
	/** The directive that emitted the change. */
	source: any;
	/** The new value. */
	value: number;
}

let numberCounter = 0;

@Directive({
	selector: "cds-number-input, [cdsNumber], [ibmNumber]",
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CdsNumberInputDirective),
			multi: true
		}
	]
})
export class CdsNumberInputDirective implements OnChanges, ControlValueAccessor {
	/** Current value. */
	@Input() value: number | null = null;

	@Input() min: number | null = null;
	@Input() max: number | null = null;
	@Input() step = 1;

	@Input() disabled = false;
	@Input() invalid = false;
	@Input() warn = false;
	@Input() readonly = false;
	@Input() required: boolean;
	@Input() hideLabel = false;
	@Input() hideSteppers = false;

	/** Input size. */
	@Input() size: "sm" | "md" | "lg" = "md";

	@Input() placeholder = "";

	/** Unique id — forwarded to the web component. */
	@Input() id = `number-${numberCounter++}`;

	/** Label rendered by the web component (string only). */
	@Input() label: string | TemplateRef<any>;
	@Input() helperText: string | TemplateRef<any>;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warnText: string | TemplateRef<any>;

	/** Assistive text for the stepper buttons. */
	@Input() decrementLabel: string;
	@Input() incrementLabel: string;

	/** Emits a `NumberChange` whenever the value changes. */
	@Output() change = new EventEmitter<NumberChange>();

	private _onChange: (value: number | null) => void = () => { };
	private _onTouched: () => void = () => { };

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("id", this.id);
		el.setAttribute("size", this.size);
		el.setAttribute("step", String(this.step));
		if (this.min !== null && this.min !== undefined) {
			el.setAttribute("min", String(this.min));
		}
		if (this.max !== null && this.max !== undefined) {
			el.setAttribute("max", String(this.max));
		}
		if (this.placeholder) {
			el.setAttribute("placeholder", this.placeholder);
		}
		if (typeof this.label === "string") {
			el.setAttribute("label", this.label);
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
		if (this.decrementLabel) {
			el.setAttribute("decrement-button-assistive-text", this.decrementLabel);
		}
		if (this.incrementLabel) {
			el.setAttribute("increment-button-assistive-text", this.incrementLabel);
		}
		if (this.value !== null && this.value !== undefined) {
			(el as any).value = String(this.value);
		}

		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("invalid", this.invalid);
		this._setBoolAttr("warn", this.warn);
		this._setBoolAttr("readonly", this.readonly);
		this._setBoolAttr("required", !!this.required);
		this._setBoolAttr("hide-label", this.hideLabel);
		this._setBoolAttr("hide-steppers", this.hideSteppers);
	}

	/** Bridge the web component's change event → `(change)` output + CVA. */
	@HostListener("cds-number-input", ["$event"])
	onChanged(event: CustomEvent): void {
		const raw = event.detail?.value ?? (event.target as any)?.value;
		const parsed = raw === "" || raw === null || raw === undefined ? null : Number(raw);
		this.value = parsed;

		const numberChange = new NumberChange();
		numberChange.source = this;
		numberChange.value = parsed as number;
		this.change.emit(numberChange);

		this._onChange(parsed);
		this._onTouched();
	}

	// ----------------------------------------------------- ControlValueAccessor
	writeValue(value: number | null): void {
		this.value = value;
		if (value !== null && value !== undefined) {
			(this._el.nativeElement as any).value = String(value);
		}
	}

	registerOnChange(fn: (value: number | null) => void): void {
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
