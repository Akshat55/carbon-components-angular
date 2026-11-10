import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";

/**
 * Adds Angular inputs to the `<cds-switcher>` web component.
 */
@Component({
	selector: "cds-switcher",
	template: "<ng-content />",
	host: {
		"[ariaLabel]": "ariaLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwitcherList {
	@Input() ariaLabel = "Switcher";
}
