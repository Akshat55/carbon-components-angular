import { Directive, HostBinding } from "@angular/core";

/**
 * Content that stays visible while a `cds-expandable-tile` is collapsed.
 */
@Directive({
	selector: "[cdsAboveFold], [ibmAboveFold]",
	standalone: true
})
export class ExpandableTileAboveFoldDirective {
	@HostBinding("class.cds--tile-content__above-the-fold") aboveFold = true;
	@HostBinding("attr.slot") slot = "above-the-fold-content";
}
