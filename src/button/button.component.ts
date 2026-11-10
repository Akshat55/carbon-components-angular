import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/button/index.js";
import { ButtonSize, ButtonType } from "./button.types";

/**
 * Wraps the `<cds-button>` web component. Importing it registers the web component.
 *
 * ```html
 * <cds-button>Primary</cds-button>
 * <cds-button cdsButton="secondary" size="sm">Secondary</cds-button>
 * <cds-button kind="ghost" href="/docs">Link</cds-button>
 * <cds-button kind="ghost"><svg cdsIcon="add" size="16" slot="icon"></svg>With icon</cds-button>
 * ```
 *
 * Content goes in the default slot; icons go in `slot="icon"`. Listen to clicks with `(click)`.
 *
 * [See demo](../../?path=/story/components-button--basic)
 */
@Component({
	selector: "cds-button",
	template: `<ng-content />`,
	host: {
		"[kind]": "resolvedKind",
		"[size]": "size",
		"[isExpressive]": "isExpressive",
		"[isSelected]": "isSelected",
		"[disabled]": "disabled",
		"[type]": "type",
		"[href]": "href",
		"[target]": "target",
		"[dangerDescription]": "dangerDescription"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CdsButton {
	/**
	 * Button kind, same values as `<button cdsButton="...">`. An empty string means `"primary"`.
	 */
	@Input() cdsButton: ButtonType | "" = "";
	/**
	 * Alias of `cdsButton`, matching the web component's attribute.
	 */
	@Input() kind: ButtonType | "" = "";
	@Input() size: ButtonSize;
	@Input() isExpressive = false;
	/**
	 * Selected state for ghost icon-only buttons.
	 */
	@Input() isSelected = false;
	@Input() disabled = false;
	@Input() type: "button" | "submit" | "reset" = "button";
	/**
	 * Renders the button as a link.
	 */
	@Input() href: string;
	@Input() target: string;
	/**
	 * Screen reader text for danger buttons.
	 */
	@Input() dangerDescription = "danger";

	/**
	 * The web component spells danger kinds with one dash (`danger-tertiary`).
	 */
	get resolvedKind() {
		return (this.kind || this.cdsButton || "primary").replace("--", "-");
	}
}
