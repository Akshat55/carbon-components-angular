/**
 * Copyright IBM Corp. 2024
 *
 * Directives: CdsOrderedListDirective / CdsUnorderedListDirective
 *
 * Sit directly on <cds-ordered-list> / <cds-unordered-list> — the web
 * component replacements for the old `[cdsList]` directive on native
 * <ol> / <ul> elements.
 *
 * Backwards-compatible API surface:
 *   [isExpressive] → isExpressive attribute
 *   [nested]       → nested attribute (previously inferred from DOM nesting)
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges
} from "@angular/core";

@Directive({
	selector: "cds-ordered-list, [cdsOrderedList]",
	standalone: true
})
export class CdsOrderedListDirective implements OnChanges {
	/** Expressive type styles. */
	@Input() isExpressive = false;

	/** Render as a nested list. */
	@Input() nested = false;

	/** Use native list numbering (for lists > 9 items). */
	@Input() native = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		setBoolAttr(this._el.nativeElement, "isExpressive", this.isExpressive);
		setBoolAttr(this._el.nativeElement, "nested", this.nested);
		setBoolAttr(this._el.nativeElement, "native", this.native);
	}
}

@Directive({
	selector: "cds-unordered-list, [cdsUnorderedList], [cdsList], [ibmList]",
	standalone: true
})
export class CdsUnorderedListDirective implements OnChanges {
	/** Expressive type styles. */
	@Input() isExpressive = false;

	/** Render as a nested list. */
	@Input() nested = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		setBoolAttr(this._el.nativeElement, "isExpressive", this.isExpressive);
		setBoolAttr(this._el.nativeElement, "nested", this.nested);
	}
}

function setBoolAttr(el: HTMLElement, name: string, value: boolean): void {
	if (value) {
		el.setAttribute(name, "");
	} else {
		el.removeAttribute(name);
	}
}
