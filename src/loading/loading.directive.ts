/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsLoadingDirective
 *
 * Sits directly on <cds-loading> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `Loading` component @Inputs
 * to web component attributes.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [title]      → description attribute (assistive text)
 *   [isActive]   → active attribute      (boolean, default: true)
 *   [size]       → small attribute       ('normal' | 'sm' — 'sm' maps to `small`)
 *   [overlay]    → overlay attribute     (boolean, default: false)
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges
} from "@angular/core";

@Directive({
	selector: "cds-loading, [cdsLoading], [ibmLoading]",
	standalone: true
})
export class CdsLoadingDirective implements OnChanges {
	/**
	 * Accessible title for the loading circle.
	 * Maps to the web component's `description` attribute.
	 */
	@Input() title: string;

	/**
	 * Set to `false` to stop the loading animation.
	 * Maps to the web component's `active` attribute.
	 */
	@Input() isActive = true;

	/**
	 * Specify the size of the loading circle.
	 * `'sm'` maps to the web component's `small` boolean attribute.
	 */
	@Input() size: "normal" | "sm" = "normal";

	/**
	 * Set to `true` to render the loader with a full-screen overlay.
	 */
	@Input() overlay = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		if (this.title) {
			el.setAttribute("description", this.title);
		}

		this._setBoolAttr("active", this.isActive);
		this._setBoolAttr("small", this.size === "sm");
		this._setBoolAttr("overlay", this.overlay);
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
