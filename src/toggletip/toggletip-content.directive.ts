import { Directive, HostBinding } from "@angular/core";

/**
 * The toggletip body; placed in the web component's `body-text` slot.
 */
@Directive({
	selector: "[cdsToggletipContent], [ibmToggletipContent]",
	standalone: true
})
export class ToggletipContent {
	@HostBinding("attr.slot") slot = "body-text";
}
