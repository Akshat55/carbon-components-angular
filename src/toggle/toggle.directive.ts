/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsToggleDirective
 *
 * Sits directly on <cds-toggle> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `Toggle` component
 * @Inputs/@Outputs to web component attributes/events, and implements
 * ControlValueAccessor so `[(ngModel)]` and reactive forms keep working.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [checked]    → toggled attribute
 *   [disabled]   → disabled attribute
 *   [size]       → size attribute ('sm' | 'md')
 *   [label]      → label-text attribute (string only)
 *   [hideLabel]  → hideLabel attribute
 *   [onText]     → label-a attribute (text shown when on)
 *   [offText]    → label-b attribute (text shown when off)
 *   (checkedChange) ← bridged from the `cds-toggle-changed` event
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

let toggleCounter = 0;

@Directive({
	selector: "cds-toggle, [cdsToggle], [ibmToggle]",
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CdsToggleDirective),
			multi: true
		}
	]
})
export class CdsToggleDirective implements OnChanges, ControlValueAccessor {
	/** Whether the toggle is on. */
	@Input() checked = false;

	/** Set to `true` to disable the toggle. */
	@Input() disabled = false;

	/** Size of the toggle. */
	@Input() size: "sm" | "md" = "md";

	/** Label text above the toggle (string only). */
	@Input() label: string | TemplateRef<any>;

	/** Visually hide the label. */
	@Input() hideLabel = false;

	/** Text shown next to the toggle when on. */
	@Input() onText: string;

	/** Text shown next to the toggle when off. */
	@Input() offText: string;

	/** Unique id — forwarded to the web component. */
	@Input() id = `toggle-${toggleCounter++}`;

	/** Emits the new checked state whenever the user flips the toggle. */
	@Output() checkedChange = new EventEmitter<boolean>();

	private _onChange: (value: boolean) => void = () => { };
	private _onTouched: () => void = () => { };

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("id", this.id);
		el.setAttribute("size", this.size);

		if (typeof this.label === "string") {
			el.setAttribute("label-text", this.label);
		}
		if (this.onText !== undefined && this.onText !== null) {
			el.setAttribute("label-a", this.onText);
		}
		if (this.offText !== undefined && this.offText !== null) {
			el.setAttribute("label-b", this.offText);
		}

		this._setBoolAttr("toggled", this.checked);
		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("hideLabel", this.hideLabel);
	}

	/** Bridge the web component's change event → Angular output + CVA. */
	@HostListener("cds-toggle-changed", ["$event"])
	onToggled(event: CustomEvent): void {
		const toggled = event.detail?.toggled ?? (event.target as any)?.toggled;
		this.checked = !!toggled;
		this.checkedChange.emit(this.checked);
		this._onChange(this.checked);
		this._onTouched();
	}

	// ----------------------------------------------------- ControlValueAccessor
	writeValue(value: boolean): void {
		this.checked = !!value;
		this._setBoolAttr("toggled", this.checked);
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
