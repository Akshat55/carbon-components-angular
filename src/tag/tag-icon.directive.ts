import { Directive } from "@angular/core";

/**
 * Puts an icon in the tag's `icon` slot.
 *
 * ```html
 * <cds-tag><svg cdsTagIcon cdsIcon="asleep" size="16"></svg>Tag</cds-tag>
 * ```
 */
@Directive({
	selector: "[cdsTagIcon], [ibmTagIcon]",
	host: { slot: "icon" }
})
export class TagIconDirective {}
