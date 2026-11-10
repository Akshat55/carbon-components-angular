/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsTagDirective
 *
 * Sits directly on <cds-tag> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `Tag` component @Inputs to
 * web component attributes.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [type]     → type attribute ('red' | 'magenta' | … | 'outline', default: 'gray')
 *   [size]     → size attribute ('sm' | 'md' | 'lg', default: 'md')
 *   [disabled] → disabled attribute
 *   [skeleton] → renders no content; prefer <cds-tag-skeleton> (see MIGRATION.md)
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges
} from "@angular/core";

/**
 * Supported tag types — unchanged from carbon-components-angular.
 */
export type TagType = "red" |
	"magenta" |
	"purple" |
	"blue" |
	"cyan" |
	"teal" |
	"green" |
	"gray" |
	"cool-gray" |
	"warm-gray" |
	"high-contrast" |
	"outline";

@Directive({
	selector: "cds-tag, [cdsTag], [ibmTag]",
	standalone: true
})
export class CdsTagDirective implements OnChanges {
	/** Type of the tag — determines the styling. */
	@Input() type: TagType = "gray";

	/** Tag render size. */
	@Input() size: "sm" | "md" | "lg" = "md";

	/** Set to `true` to disable the tag. */
	@Input() disabled = false;

	/**
	 * @deprecated use `<cds-tag-skeleton>` instead — the web component ships a
	 * dedicated skeleton element. Kept so old bindings don't break the build.
	 */
	@Input() skeleton = false;

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
