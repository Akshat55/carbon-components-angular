import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { ShellLink } from "../shell-link.class";

/**
 * Adds router navigation and `active` to the `<cds-switcher-item>` web component.
 */
@Component({
	selector: "cds-switcher-item",
	template: "<ng-content />",
	host: {
		"[href]": "href ?? ''",
		"[selected]": "active",
		"[attr.target]": "target",
		"(click)": "navigate($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwitcherListItem extends ShellLink {
	@Input() active = false;
	@Input() target: string;
}
