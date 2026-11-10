/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsSelectItemGroupDirective
 *
 * Sits directly on <cds-select-item-group> — the web component replacement
 * for the old native `<optgroup>` (styled by the removed `OptGroup` directive).
 *
 * Backwards-compatible API surface:
 *   [label]    → label attribute
 *   [disabled] → disabled attribute
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges
} from "@angular/core";

@Directive({
	selector: "cds-select-item-group, [cdsOptgroup]",
	standalone: true
})
export class CdsSelectItemGroupDirective implements OnChanges {
	/** Group label. */
	@Input() label: string;

	/** Set to `true` to disable the whole group. */
	@Input() disabled = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;
		if (this.label) {
			el.setAttribute("label", this.label);
		}
		if (this.disabled) {
			el.setAttribute("disabled", "");
		} else {
			el.removeAttribute("disabled");
		}
	}
}
