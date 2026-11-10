/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsRadioGroupDirective
 *
 * Sits directly on <cds-radio-button-group> — the web component replacement
 * for the old Angular `RadioGroup` component (<cds-radio-group>).
 * Implements ControlValueAccessor so `[(ngModel)]` and reactive forms keep
 * working exactly as before.
 *
 * Backwards-compatible API surface (matches carbon-components-angular RadioGroup):
 *   [value] [name] [disabled] [orientation] [required]
 *   [labelPlacement] → label-position attribute
 *   [legend]         → legend-text attribute (string only)
 *   [helperText] [invalid] [invalidText] [warn] [warnText] — unchanged
 *   (change)         ← bridged from `cds-radio-button-group-changed`
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
import { RadioChange } from "./radio-change.class";

@Directive({
	selector: "cds-radio-button-group, [cdsRadioGroup], [ibmRadioGroup]",
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CdsRadioGroupDirective),
			multi: true
		}
	]
})
export class CdsRadioGroupDirective implements OnChanges, ControlValueAccessor {
	/** The currently selected value. */
	@Input() value: any;

	/** Group name applied to all child radios. */
	@Input() name: string;

	/** Set to `true` to disable the whole group. */
	@Input() disabled = false;

	/** Layout orientation of the radios. */
	@Input() orientation: "horizontal" | "vertical" = "horizontal";

	/** Placement of the labels relative to the controls. */
	@Input() labelPlacement: "right" | "left" = "right";

	/** Legend for the group (string only). */
	@Input() legend: string | TemplateRef<any>;

	/** Helper text shown under the group (string only). */
	@Input() helperText: string | TemplateRef<any>;

	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;

	/** Emits a `RadioChange` whenever the selection changes. */
	@Output() change: EventEmitter<RadioChange> = new EventEmitter<RadioChange>();

	private _onChange: (value: any) => void = () => { };
	private _onTouched: () => void = () => { };

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		if (this.name) {
			el.setAttribute("name", this.name);
		}
		if (this.value !== undefined && this.value !== null) {
			el.setAttribute("value", String(this.value));
		}
		el.setAttribute("orientation", this.orientation);
		el.setAttribute("label-position", this.labelPlacement);

		if (typeof this.legend === "string") {
			el.setAttribute("legend-text", this.legend);
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

		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("invalid", this.invalid);
		this._setBoolAttr("warn", this.warn);
	}

	/** Bridge the web component's group change event → `(change)` output + CVA. */
	@HostListener("cds-radio-button-group-changed", ["$event"])
	onChanged(event: CustomEvent): void {
		const value = event.detail?.value;
		this.value = value;
		this.change.emit(new RadioChange(event.target, value));
		this._onChange(value);
		this._onTouched();
	}

	// ----------------------------------------------------- ControlValueAccessor
	writeValue(value: any): void {
		this.value = value;
		if (value !== undefined && value !== null) {
			this._el.nativeElement.setAttribute("value", String(value));
		} else {
			this._el.nativeElement.removeAttribute("value");
		}
	}

	registerOnChange(fn: (value: any) => void): void {
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
