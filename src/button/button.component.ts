import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/button/index.js";
import { ButtonSize, ButtonType } from "./button.types";

/**
 * Adds Angular inputs and outputs to the `<cds-button>` web component. Importing it registers the web component.
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
		"[kind]": "resolvedKind ?? element.kind",
		"[size]": "size ?? element.size",
		"[isExpressive]": "isExpressive ?? element.isExpressive",
		"[isSelected]": "isSelected ?? element.isSelected",
		"[disabled]": "disabled ?? element.disabled",
		"[type]": "type ?? element.type",
		"[href]": "href ?? element.href",
		"[target]": "target ?? element.target",
		"[dangerDescription]": "dangerDescription ?? element.dangerDescription"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CdsButton {
	/**
	 * Button kind, same values as `<button cdsButton="...">`. Unset or empty, the web
	 * component's default (`"primary"`) applies.
	 */
	@Input() cdsButton?: ButtonType | "";
	/**
	 * Alias of `cdsButton`, matching the web component's attribute.
	 */
	@Input() kind?: ButtonType | "";
	/**
	 * The web component's default is `"lg"`.
	 */
	@Input() size?: ButtonSize;
	@Input({ transform: booleanAttribute }) isExpressive?: boolean;
	/**
	 * Selected state for ghost icon-only buttons.
	 */
	@Input({ transform: booleanAttribute }) isSelected?: boolean;
	@Input({ transform: booleanAttribute }) disabled?: boolean;
	/**
	 * The web component's default is `"button"`.
	 */
	@Input() type?: "button" | "submit" | "reset";
	/**
	 * Renders the button as a link.
	 */
	@Input() href: string;
	@Input() target: string;
	/**
	 * Screen reader text for danger buttons. The web component's default is empty
	 * (v6 used `"danger"`).
	 */
	@Input() dangerDescription?: string;

	/**
	 * The web component spells danger kinds with one dash (`danger-tertiary`).
	 */
	get resolvedKind() {
		return (this.kind || this.cdsButton)?.replace("--", "-") || undefined;
	}

	readonly element: any = inject(ElementRef).nativeElement;

	/**
	 * Focuses the button, e.g. to pass `#button` as a modal's `trigger`.
	 */
	focus(options?: FocusOptions) {
		this.element.focus(options);
	}
}
