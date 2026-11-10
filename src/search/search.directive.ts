/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsSearchDirective
 *
 * Sits directly on <cds-search> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `Search` component
 * @Inputs/@Outputs to web component attributes/events, and implements
 * ControlValueAccessor so `[(ngModel)]` and reactive forms keep working.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [value] [disabled] [expandable] [name] [id] [size] [required]
 *   [autocomplete]     → autocomplete attribute
 *   [label]            → label-text attribute
 *   [placeholder]      → placeholder attribute
 *   [clearButtonTitle] → close-button-label-text attribute
 *   (valueChange)      ← bridged from `cds-search-input`
 *   (search)           ← emitted alongside valueChange (parity with old API)
 *   (clear)            ← emitted when the value is cleared
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

let searchCounter = 0;

@Directive({
	selector: "cds-search, [cdsSearch], [ibmSearch]",
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CdsSearchDirective),
			multi: true
		}
	]
})
export class CdsSearchDirective implements OnChanges, ControlValueAccessor {
	/** Size of the search input. */
	@Input() size: "sm" | "md" | "lg" = "md";

	/** Set to `true` to disable the input. */
	@Input() disabled = false;

	/** Set to `true` for an expandable search field. */
	@Input() expandable = false;

	/** Form control name. */
	@Input() name: string;

	/** Unique id — forwarded to the web component. */
	@Input() id = `search-${searchCounter++}`;

	/** Set to `true` to require a value. */
	@Input() required: boolean;

	/** Current search value. */
	@Input() value = "";

	/** Native autocomplete attribute. */
	@Input() autocomplete = "on";

	/** Accessible label for the search field. */
	@Input() label = "Search";

	/** Input placeholder. */
	@Input() placeholder = "Search";

	/** Title for the clear ("x") button. */
	@Input() clearButtonTitle = "Clear search input";

	/** Emits the current value on every input. */
	@Output() valueChange = new EventEmitter<string>();

	/** Emits the current value on every input (kept for API parity). */
	@Output() search = new EventEmitter<string>();

	/** Emits when the value is cleared. */
	@Output() clear = new EventEmitter();

	private _onChange: (value: string) => void = () => { };
	private _onTouched: () => void = () => { };

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("id", this.id);
		el.setAttribute("size", this.size);
		el.setAttribute("autocomplete", this.autocomplete);
		el.setAttribute("label-text", this.label);
		el.setAttribute("placeholder", this.placeholder);
		el.setAttribute("close-button-label-text", this.clearButtonTitle);
		if (this.name) {
			el.setAttribute("name", this.name);
		}
		(el as any).value = this.value;

		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("expandable", this.expandable);
		this._setBoolAttr("required", !!this.required);
	}

	/** Bridge the web component's input event → Angular outputs + CVA. */
	@HostListener("cds-search-input", ["$event"])
	onInput(event: CustomEvent): void {
		const value = event.detail?.value ?? (event.target as any)?.value ?? "";
		this.value = value;
		this.valueChange.emit(value);
		this.search.emit(value);
		if (value === "") {
			this.clear.emit();
		}
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
