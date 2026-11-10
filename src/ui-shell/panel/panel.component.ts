import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";

/**
 * Adds Angular inputs to the `<cds-header-panel>` web component.
 */
@Component({
	selector: "cds-header-panel",
	template: "<ng-content />",
	host: {
		"[expanded]": "expanded",
		"[attr.aria-label]": "ariaLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Panel {
	@Input() expanded = false;
	@Input() ariaLabel: string;
}
