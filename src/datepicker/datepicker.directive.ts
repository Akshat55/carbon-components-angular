/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsDatePickerDirective
 *
 * Sits directly on <cds-date-picker> — no wrapper element, no extra DOM node.
 *
 * The web component expects <cds-date-picker-input> children. To preserve the
 * old carbon-components-angular API — where [label], [placeholder], [range]
 * lived on the datepicker itself — this directive generates the input
 * children automatically when none are projected.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [range] [dateFormat] [label] [rangeLabel] [placeholder] [id]
 *   [disabled] [readonly] [invalid] [invalidText] [warn] [warnText] [size]
 *   [value]        → array of Date/strings, mapped to the web component value
 *   (valueChange)  ← bridged from the `cds-date-picker-changed` event
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	TemplateRef
} from "@angular/core";

let datePickerCounter = 0;

@Directive({
	selector: "cds-date-picker, [cdsDatePicker], [ibmDatePicker]",
	standalone: true
})
export class CdsDatePickerDirective implements OnChanges {
	/** Range mode — renders "from" and "to" inputs. */
	@Input() range = false;

	/** flatpickr date format. */
	@Input() dateFormat = "m/d/Y";

	/** Label for the (first) input (string only). */
	@Input() label: string | TemplateRef<any>;

	/** Label for the range end input (string only). */
	@Input() rangeLabel: string;

	/** Input placeholder. */
	@Input() placeholder = "mm/dd/yyyy";

	/** Unique id — forwarded to the web component. */
	@Input() id = `datepicker-${datePickerCounter++}`;

	/** Selected date(s). */
	@Input() value: (Date | string)[] = [];

	@Input() disabled = false;
	@Input() readonly = false;
	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;
	@Input() size: "sm" | "md" | "lg" = "md";

	/** Emits the array of selected dates on change. */
	@Output() valueChange = new EventEmitter<any>();

	private _inputsGenerated = false;

	constructor(private _el: ElementRef<HTMLElement>) {
		// The change event is registered manually since the event name is dynamic.
		this._el.nativeElement.addEventListener("cds-date-picker-changed", (event: Event) => {
			const detail = (event as CustomEvent).detail;
			this.value = detail?.selectedDates ?? [];
			this.valueChange.emit(this.value);
		});
	}

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("id", this.id);
		el.setAttribute("date-format", this.dateFormat);

		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("readonly", this.readonly);

		this._ensureInputs();

		if (this.value && this.value.length) {
			(el as any).value = this.value
				.map((d) => (d instanceof Date ? d.toLocaleDateString("en-US") : d))
				.join("/");
		}
	}

	/**
	 * Generates <cds-date-picker-input> children when none were projected,
	 * mirroring the old component's self-contained rendering.
	 */
	private _ensureInputs(): void {
		const el = this._el.nativeElement;

		if (this._inputsGenerated || el.querySelector("cds-date-picker-input")) {
			this._updateInputs();
			return;
		}

		const makeInput = (kind: string, label: string | undefined): HTMLElement => {
			const input = document.createElement("cds-date-picker-input");
			input.setAttribute("kind", kind);
			input.setAttribute("placeholder", this.placeholder);
			if (label) {
				input.setAttribute("label-text", label);
			}
			return input;
		};

		if (this.range) {
			el.appendChild(makeInput("from", typeof this.label === "string" ? this.label : undefined));
			el.appendChild(makeInput("to", this.rangeLabel));
		} else {
			el.appendChild(makeInput("single", typeof this.label === "string" ? this.label : undefined));
		}
		this._inputsGenerated = true;
		this._updateInputs();
	}

	/** Push validation/size state down to the input children. */
	private _updateInputs(): void {
		const inputs = this._el.nativeElement.querySelectorAll("cds-date-picker-input");
		inputs.forEach((input) => {
			input.setAttribute("size", this.size);
			this._toggle(input as HTMLElement, "invalid", this.invalid);
			this._toggle(input as HTMLElement, "warn", this.warn);
			this._toggle(input as HTMLElement, "disabled", this.disabled);
			if (typeof this.invalidText === "string") {
				input.setAttribute("invalid-text", this.invalidText);
			}
			if (typeof this.warnText === "string") {
				input.setAttribute("warn-text", this.warnText);
			}
		});
	}

	private _toggle(el: HTMLElement, name: string, value: boolean): void {
		if (value) {
			el.setAttribute(name, "");
		} else {
			el.removeAttribute(name);
		}
	}

	private _setBoolAttr(name: string, value: boolean): void {
		this._toggle(this._el.nativeElement, name, value);
	}
}
