/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsSelectItemDirective
 *
 * Sits directly on <cds-select-item> — the web component replacement for the
 * old native `<option>` (styled by the removed `Option` directive).
 *
 * Backwards-compatible API surface:
 *   [value]    → value attribute
 *   [disabled] → disabled attribute
 *   [selected] → selected attribute
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges
} from "@angular/core";

@Directive({
	selector: "cds-select-item, [cdsOption]",
	standalone: true
})
export class CdsSelectItemDirective implements OnChanges {
	/** Value submitted when this item is selected. */
	@Input() value: any;

	/** Set to `true` to disable this item. */
	@Input() disabled = false;

	/** Set to `true` to select this item initially. */
	@Input() selected = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;
		if (this.value !== undefined && this.value !== null) {
			el.setAttribute("value", String(this.value));
		}
		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("selected", this.selected);
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
