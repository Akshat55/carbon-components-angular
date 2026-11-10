/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsTagIconDirective
 *
 * Routes a custom icon element into the tag web component's `icon` slot and
 * flags the parent tag with `has-custom-icon`, replacing the old class-based
 * `TagIconDirective`.
 */
import { Directive, ElementRef, OnInit } from "@angular/core";

@Directive({
	selector: "[cdsTagIcon], [ibmTagIcon]",
	standalone: true
})
export class CdsTagIconDirective implements OnInit {
	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnInit(): void {
		const el = this._el.nativeElement;
		el.setAttribute("slot", "icon");
		// The tag web component adjusts its padding when a custom icon is present.
		el.parentElement?.setAttribute("has-custom-icon", "");
	}
}
