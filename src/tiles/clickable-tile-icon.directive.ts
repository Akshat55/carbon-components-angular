import { Directive, HostBinding } from "@angular/core";

/**
 * Marks the icon of a `cds-clickable-tile`.
 */
@Directive({
	selector: "[cdsClickableTileIcon], [ibmClickableTileIcon]",
	standalone: true
})
export class ClickableTileIconDirective {
	@HostBinding("class.cds--tile--icon") icon = true;
}
