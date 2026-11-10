/**
 * Copyright IBM Corp. 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Directive: CdsLinkDirective
 *
 * Sits directly on <cds-link> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `Link` directive @Inputs to
 * web component attributes.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [inline]     → inline attribute    (boolean, default: false)
 *   [size]       → size attribute      ('sm' | 'md' | 'lg', default: 'md')
 *   [visited]    → visited attribute   (boolean, default: false)
 *   [disabled]   → disabled attribute  (boolean, default: false)
 *
 * Native anchor attributes (href, target, rel, download, …) are also exposed
 * as inputs since the web component reflects them onto its internal <a>.
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges
} from "@angular/core";

@Directive({
	// Matches the web component tag — no extra element in the DOM.
	// The old attribute selectors are kept for backwards compatibility.
	selector: "cds-link, [cdsLink], [ibmLink]",
	standalone: true
})
export class CdsLinkDirective implements OnChanges {
	/**
	 * Set to `true` to show links inline in a sentence or paragraph.
	 */
	@Input() inline = false;

	/**
	 * Set to `sm`, `md`, or `lg` to scale the link typography.
	 */
	@Input() size: "sm" | "md" | "lg" = "md";

	/**
	 * Set to `true` to apply visited link styling.
	 */
	@Input() visited = false;

	/**
	 * Set to `true` to disable the link.
	 */
	@Input() disabled = false;

	/**
	 * Link destination — forwarded to the web component's internal anchor.
	 */
	@Input() href: string;

	/** Anchor `target`, forwarded to the internal anchor. */
	@Input() target: string;

	/** Anchor `rel`, forwarded to the internal anchor. */
	@Input() rel: string;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("size", this.size);

		this._setBoolAttr("inline", this.inline);
		this._setBoolAttr("visited", this.visited);
		this._setBoolAttr("disabled", this.disabled);

		this._setStrAttr("href", this.href);
		this._setStrAttr("target", this.target);
		this._setStrAttr("rel", this.rel);
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}

	private _setStrAttr(name: string, value: string | undefined): void {
		if (value !== undefined && value !== null) {
			this._el.nativeElement.setAttribute(name, value);
		}
	}
}
