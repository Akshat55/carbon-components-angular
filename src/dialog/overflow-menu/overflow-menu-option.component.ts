import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output
} from "@angular/core";
import "@carbon/web-components/es/components/overflow-menu/index.js";

/**
 * Possible link targets for `href` options.
 */
export enum Target {
	self = "_self",
	blank = "_blank",
	parent = "_parent",
	top = "_top"
}

/**
 * Adds Angular inputs and `(selected)` to the `<cds-overflow-menu-item>` web component.
 * Use inside `cds-overflow-menu`.
 */
@Component({
	selector: "cds-overflow-menu-item",
	template: "<ng-content />",
	host: {
		"[danger]": "type === 'danger'",
		"[disabled]": "disabled",
		"[divider]": "divider",
		"[href]": "href ?? ''",
		"[attr.target]": "target",
		"(click)": "onClick($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverflowMenuOption {
	@Input() type: "normal" | "danger" = "normal";
	@Input() disabled = false;
	/**
	 * Renders the option as a link.
	 */
	@Input() href: string;
	@Input() target: Target;
	/**
	 * Draws a divider above the option.
	 */
	@Input() divider = false;

	/**
	 * Emits when the option is chosen.
	 */
	@Output() selected: EventEmitter<any> = new EventEmitter();

	onClick(event: Event) {
		if (!this.disabled) {
			this.selected.emit(event);
		}
	}
}
