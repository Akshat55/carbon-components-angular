import { Directive, HostBinding, Input } from "@angular/core";

/**
 * The toggletip trigger icon. The web component renders the button itself, so this
 * element is placed in its `trigger` slot.
 */
@Directive({
	selector: "[cdsToggletipButton], [ibmToggletipButton]",
	standalone: true
})
export class ToggletipButton {
	@HostBinding("attr.slot") slot = "trigger";
	@HostBinding("attr.tabindex") tabIndex = -1;
	/**
	 * @deprecated set `buttonLabel` on `cds-toggletip`.
	 */
	@Input() ariaLabel = "Show information";
}
