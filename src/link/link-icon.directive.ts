import { Directive, HostBinding } from "@angular/core";

@Directive({
	selector: "[ibmLinkIcon], [cdsLinkIcon]",
	standalone: true
})
export class LinkIconDirective {
	@HostBinding("class.cds--link__icon") iconClass = true;
	/**
	 * Puts the icon in the `icon` slot when used inside `<cds-link>`.
	 */
	@HostBinding("attr.slot") slot = "icon";
}
