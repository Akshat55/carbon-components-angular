/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsLinkIconDirective
 *
 * Routes an icon element into the <cds-link> web component's `icon` slot.
 * Replaces the old `LinkIcon` directive which applied the
 * `cds--link__icon` class — the web component now handles icon styling
 * through its shadow DOM slot.
 *
 * Usage is unchanged from carbon-components-angular:
 *
 * ```html
 * <cds-link href="#">
 *   Link with icon
 *   <svg cdsLinkIcon cdsIcon="add" size="16"></svg>
 * </cds-link>
 * ```
 */
import { Directive, ElementRef, OnInit } from "@angular/core";

@Directive({
	selector: "[cdsLinkIcon], [ibmLinkIcon]",
	standalone: true
})
export class CdsLinkIconDirective implements OnInit {
	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnInit(): void {
		// The web component exposes a named `icon` slot for trailing icons.
		this._el.nativeElement.setAttribute("slot", "icon");
	}
}
