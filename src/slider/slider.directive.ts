/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsSliderDirective
 *
 * Sits directly on <cds-slider> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `Slider` component
 * @Inputs/@Outputs to web component attributes/events, and implements
 * ControlValueAccessor so `[(ngModel)]` and reactive forms keep working.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [min] [max] [step] [value] [disabled] [readonly]
 *   [label]        → label-text attribute (string only)
 *   (valueChange)  ← bridged from the `cds-slider-changed` event
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

@Directive({
	selector: "cds-slider, [cdsSlider], [ibmSlider]",
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CdsSliderDirective),
			multi: true
		}
	]
})
export class CdsSliderDirective implements OnChanges, ControlValueAccessor {
	/** Minimum value. */
	@Input() min = 0;

	/** Maximum value. */
	@Input() max = 100;

	/** Step increment. */
	@Input() step = 1;

	/** Current value. */
	@Input() value: number;

	/** Label above the slider (string only). */
	@Input() label: string | TemplateRef<any>;

	@Input() disabled = false;
	@Input() readonly = false;

	/** Emits the new value whenever the handle moves. */
	@Output() valueChange: EventEmitter<number | number[]> = new EventEmitter();

	private _onChange: (value: number) => void = () => { };
	private _onTouched: () => void = () => { };

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("min", String(this.min));
		el.setAttribute("max", String(this.max));
		el.setAttribute("step", String(this.step));

		if (typeof this.label === "string") {
			el.setAttribute("label-text", this.label);
		}
		if (this.value !== undefined && this.value !== null) {
			(el as any).value = this.value;
		}

		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("readonly", this.readonly);
	}

	/** Bridge the web component's change events → `(valueChange)` + CVA. */
	@HostListener("cds-slider-changed", ["$event"])
	@HostListener("cds-slider-input-changed", ["$event"])
	onChanged(event: CustomEvent): void {
		const value = Number(event.detail?.value ?? (event.target as any)?.value);
		if (Number.isNaN(value)) {
			return;
		}
		this.value = value;
		this.valueChange.emit(value);
		this._onChange(value);
		this._onTouched();
	}

	// ----------------------------------------------------- ControlValueAccessor
	writeValue(value: number): void {
		this.value = value;
		if (value !== undefined && value !== null) {
			(this._el.nativeElement as any).value = value;
		}
	}

	registerOnChange(fn: (value: number) => void): void {
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
