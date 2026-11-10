/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsSelectDirective
 *
 * Sits directly on <cds-select> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `Select` component
 * @Inputs/@Outputs to web component attributes/events, and implements
 * ControlValueAccessor so `[(ngModel)]` and reactive forms keep working.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [value] [disabled] [size] [invalid] [warn] [readonly] [hideLabel] [id]
 *   [label]       → label-text attribute (string only)
 *   [helperText]  → helper-text attribute (string only)
 *   [invalidText] → invalid-text attribute (string only)
 *   [warnText]    → warn-text attribute (string only)
 *   [display]     → 'inline' maps to the inline attribute
 *   (valueChange) ← bridged from the `cds-select-selected` event
 *
 * Options use <cds-select-item> / <cds-select-item-group> — see MIGRATION.md.
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

let selectCounter = 0;

@Directive({
	selector: "cds-select, [cdsSelect], [ibmSelect]",
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CdsSelectDirective),
			multi: true
		}
	]
})
export class CdsSelectDirective implements OnChanges, ControlValueAccessor {
	/** The currently selected value. */
	@Input() value: any;

	/** Display mode — 'inline' maps to the web component's inline attribute. */
	@Input() display: "inline" | "default" = "default";

	/** Label for the select (string only). */
	@Input() label: string | TemplateRef<any>;

	/** Helper text (string only). */
	@Input() helperText: string | TemplateRef<any>;

	/** Message shown when invalid (string only). */
	@Input() invalidText: string | TemplateRef<any>;

	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;

	/** Unique id — forwarded to the web component. */
	@Input() id = `select-${selectCounter++}`;

	/** Input size. */
	@Input() size: "sm" | "md" | "lg" = "md";

	@Input() disabled = false;
	@Input() invalid = false;
	@Input() readonly = false;
	@Input() hideLabel = false;

	/** Emits the newly selected value. */
	@Output() valueChange = new EventEmitter();

	private _onChange: (value: any) => void = () => { };
	private _onTouched: () => void = () => { };

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("id", this.id);
		el.setAttribute("size", this.size);

		if (typeof this.label === "string") {
			el.setAttribute("label-text", this.label);
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
		if (this.value !== undefined && this.value !== null) {
			(el as any).value = String(this.value);
		}

		this._setBoolAttr("inline", this.display === "inline");
		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("invalid", this.invalid);
		this._setBoolAttr("warn", this.warn);
		this._setBoolAttr("readonly", this.readonly);
		this._setBoolAttr("hide-label", this.hideLabel);
	}

	/** Bridge the web component's select event → `(valueChange)` + CVA. */
	@HostListener("cds-select-selected", ["$event"])
	onSelected(event: CustomEvent): void {
		const value = event.detail?.value ?? (event.target as any)?.value;
		this.value = value;
		this.valueChange.emit(value);
		this._onChange(value);
		this._onTouched();
	}

	// ----------------------------------------------------- ControlValueAccessor
	writeValue(value: any): void {
		this.value = value;
		if (value !== undefined && value !== null) {
			(this._el.nativeElement as any).value = String(value);
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
