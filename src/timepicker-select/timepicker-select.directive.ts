/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsTimePickerSelectDirective
 *
 * Sits directly on <cds-time-picker-select> — the web component replacement
 * for the old Angular TimePickerSelect (<cds-timepicker-select>).
 * Options use <cds-select-item> children.
 *
 * Backwards-compatible API surface:
 *   [label]        → label-text attribute (visually hidden by the component)
 *   [disabled]     → disabled attribute
 *   [value]        → value property
 *   (valueChange)  ← bridged from the `cds-select-selected` event
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	Output,
	TemplateRef
} from "@angular/core";

let timePickerSelectCounter = 0;

@Directive({
	selector: "cds-time-picker-select, cds-timepicker-select, [cdsTimePickerSelect], [ibmTimePickerSelect]",
	standalone: true
})
export class CdsTimePickerSelectDirective implements OnChanges {
	/** Accessible label for the select. */
	@Input() label: string | TemplateRef<any>;

	/** Set to `true` to disable the select. */
	@Input() disabled = false;

	/** Currently selected value. */
	@Input() value: string;

	/** Unique id — forwarded to the web component. */
	@Input() id = `timepicker-select-${timePickerSelectCounter++}`;

	/** Emits the newly selected value. */
	@Output() valueChange = new EventEmitter<string>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("id", this.id);
		if (typeof this.label === "string") {
			el.setAttribute("label-text", this.label);
		}
		if (this.value !== undefined && this.value !== null) {
			(el as any).value = this.value;
		}
		if (this.disabled) {
			el.setAttribute("disabled", "");
		} else {
			el.removeAttribute("disabled");
		}
	}

	@HostListener("cds-select-selected", ["$event"])
	onSelected(event: CustomEvent): void {
		const value = event.detail?.value ?? (event.target as any)?.value;
		this.value = value;
		this.valueChange.emit(value);
	}
}
