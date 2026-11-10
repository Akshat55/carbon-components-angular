/**
 * Copyright IBM Corp. 2024
 *
 * Directives: CdsContainedListDirective / CdsContainedListItemDirective
 *
 * Sit directly on <cds-contained-list> / <cds-contained-list-item> — the web
 * component replacements for the old Angular ContainedList components.
 *
 * Backwards-compatible API surface:
 *   List:  [label] (string) → label attribute
 *          [kind]           → kind attribute ('on-page' | 'disclosed')
 *          [size]           → size attribute ('sm' | 'md' | 'lg' | 'xl')
 *          [isInset]        → is-inset attribute
 *   Item:  [disabled]       → disabled attribute
 *          (click)          → native click passthrough (unchanged)
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges,
	TemplateRef
} from "@angular/core";

@Directive({
	selector: "cds-contained-list, [cdsContainedList], [ibmContainedList]",
	standalone: true
})
export class CdsContainedListDirective implements OnChanges {
	/** List header label (string only). */
	@Input() label: string | TemplateRef<any>;

	/** Kind of the contained list. */
	@Input() kind: "on-page" | "disclosed" = "on-page";

	/** Size of the list items. */
	@Input() size: "sm" | "md" | "lg" | "xl" = "lg";

	/** Set to `true` for inset list styling. */
	@Input() isInset = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		if (typeof this.label === "string") {
			el.setAttribute("label", this.label);
		}
		el.setAttribute("kind", this.kind);
		el.setAttribute("size", this.size);

		if (this.isInset) {
			el.setAttribute("is-inset", "");
		} else {
			el.removeAttribute("is-inset");
		}
	}
}

@Directive({
	selector: "cds-contained-list-item, [cdsContainedListItem], [ibmContainedListItem]",
	standalone: true
})
export class CdsContainedListItemDirective implements OnChanges {
	/** Set to `true` to disable this item. */
	@Input() disabled = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		if (this.disabled) {
			this._el.nativeElement.setAttribute("disabled", "");
		} else {
			this._el.nativeElement.removeAttribute("disabled");
		}
	}
}
