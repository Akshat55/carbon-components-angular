import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";

/**
 * A divider between `cds-side-nav` items.
 *
 * Angular class for the `<cds-side-nav-divider>` web component, so templates can use it without
 * `CUSTOM_ELEMENTS_SCHEMA`. Importing it registers the web component.
 */
@Component({
	selector: "cds-side-nav-divider",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SideNavDivider {}
