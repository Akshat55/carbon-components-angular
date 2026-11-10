/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsButtonSetDirective
 *
 * Sits directly on <cds-button-set> — the web component replacement for the
 * old Angular `ButtonSet` component.
 *
 * Backwards-compatible API surface:
 *   [fluid]   → fluid attribute
 *   [stacked] → stacked attribute
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges
} from "@angular/core";

@Directive({
	selector: "cds-button-set, [cdsButtonSet], [ibmButtonSet]",
	standalone: true
})
export class CdsButtonSetDirective implements OnChanges {
	/** When `true`, buttons grow to fill the container width. */
	@Input() fluid = false;

	/** When `true`, stacks buttons vertically. */
	@Input() stacked = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		this._setBoolAttr("fluid", this.fluid);
		this._setBoolAttr("stacked", this.stacked);
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
