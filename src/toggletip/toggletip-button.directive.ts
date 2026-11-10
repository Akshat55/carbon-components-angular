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
	 * v6 templates put a `<button>` here; only its icon should show inside the web component's button.
	 */
	@HostBinding("style.display") display = "contents";
	/**
	 * @deprecated set `buttonLabel` on `cds-toggletip`.
	 */
	@Input() ariaLabel = "Show information";
}
