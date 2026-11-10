/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsOperationalTagDirective
 *
 * Sits directly on <cds-operational-tag> — the web component replacement for
 * the old Angular `TagOperationalComponent` (<cds-tag-operational>).
 *
 * Backwards-compatible API surface:
 *   [type]     → type attribute
 *   [size]     → size attribute
 *   [disabled] → disabled attribute
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges
} from "@angular/core";
import { TagType } from "./tag.directive";

@Directive({
	selector: "cds-operational-tag, [cdsTagOperational], [ibmTagOperational]",
	standalone: true
})
export class CdsOperationalTagDirective implements OnChanges {
	/** Type of the tag — determines the styling. */
	@Input() type: TagType = "gray";

	/** Tag render size. */
	@Input() size: "sm" | "md" | "lg" = "md";

	/** Set to `true` to disable the tag. */
	@Input() disabled = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;
		el.setAttribute("type", this.type);
		el.setAttribute("size", this.size);
		if (this.disabled) {
			el.setAttribute("disabled", "");
		} else {
			el.removeAttribute("disabled");
		}
	}
}
