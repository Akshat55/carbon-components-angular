/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsRadioDirective
 *
 * Sits directly on <cds-radio-button> — the web component replacement for
 * the old Angular `Radio` component (<cds-radio>).
 *
 * Backwards-compatible API surface (matches carbon-components-angular Radio):
 *   [checked] [name] [disabled] [value] [id] [required]
 *   [labelPlacement] → label-position attribute
 *   (change)         ← bridged from the `cds-radio-button-changed` event
 *
 * The label is projected through the web component's default slot, so
 * `<cds-radio-button [value]="one">One</cds-radio-button>` works like the
 * old `<cds-radio>` usage.
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	Output
} from "@angular/core";
import { RadioChange } from "./radio-change.class";

let radioCounter = 0;

@Directive({
	selector: "cds-radio-button, [cdsRadio], [ibmRadio]",
	standalone: true
})
export class CdsRadioDirective implements OnChanges {
	/** Whether this radio is checked. */
	@Input() checked = false;

	/** Radio group name. Usually set by the parent group directive. */
	@Input() name = "";

	/** Set to `true` to disable this radio. */
	@Input() disabled = false;

	/** Placement of the label relative to the control. */
	@Input() labelPlacement: "right" | "left" = "right";

	/** Value submitted when this radio is selected. */
	@Input() value: any;

	/** Set to `true` to require a selection. */
	@Input() required = false;

	/** Unique id — forwarded to the web component. */
	@Input() id = `radio-${radioCounter++}`;

	/** Emits a `RadioChange` when this radio is selected. */
	@Output() change = new EventEmitter<RadioChange>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("id", this.id);
		if (this.name) {
			el.setAttribute("name", this.name);
		}
		if (this.value !== undefined && this.value !== null) {
			el.setAttribute("value", String(this.value));
		}
		el.setAttribute("label-position", this.labelPlacement);

		this._setBoolAttr("checked", this.checked);
		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("required", this.required);
	}

	/** Bridge the web component's change event → Angular `(change)` output. */
	@HostListener("cds-radio-button-changed", ["$event"])
	onChanged(event: CustomEvent): void {
		this.checked = true;
		this.change.emit(new RadioChange(this, this.value));
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
