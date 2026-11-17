import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

/**
 * Base button with common input properties for configuring icon button.
 * Extend class to inherit @Input meta data
 *
 * Used by pagination nav icon button, code snippet, etc.
 *
 * Every input is optional: unset, the web component (or tooltip) a subclass passes it to
 * keeps its own default.
 */
@Component({
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true
})
export class BaseIconButton {
	/**
	 * Set to `false` to hide caret. Not supported by `cds-icon-button`, whose tooltip
	 * always has a caret.
	 */
	@Input() caret?: boolean;
	/**
	 * Set to `false` to hide shadow. Not supported by `cds-icon-button`.
	 */
	@Input() dropShadow?: boolean;
	/**
	 * Set to `true` to enable high contrast. Not supported by `cds-icon-button`, whose
	 * tooltip is always high contrast.
	 */
	@Input() highContrast?: boolean;
	/**
	 * Set to `true` to have the popover open by default
	 */
	@Input() isOpen?: boolean;
	/**
	 * Set popover alignment. The `cds-icon-button` default is `"top"`.
	 */
	@Input() align?: "top" | "top-left" | "top-right" |
		"bottom" | "bottom-left" | "bottom-right" |
		"left" | "left-bottom" | "left-top" |
		"right" | "right-bottom" | "right-top";
	/**
	 * **Experimental**: Use floating-ui to position the tooltip
	 * This is not supported in angular 13
	 */
	@Input() autoAlign?: boolean;
	/**
	 * Set delay before tooltip is shown. The `cds-icon-button` default is 100.
	 */
	@Input() enterDelayMs?: number;
	/**
	 * Set delay when tooltip disappears. The `cds-icon-button` default is 100.
	 */
	@Input() leaveDelayMs?: number;
}
