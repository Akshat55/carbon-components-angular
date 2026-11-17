import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import "@carbon/web-components/es/components/toggle/index.js";

/**
 * Loading state of a toggle.
 *
 * Angular class for the `<cds-toggle-skeleton>` web component, so templates can use it without
 * `CUSTOM_ELEMENTS_SCHEMA`. Importing it registers the web component.
 */
@Component({
	selector: "cds-toggle-skeleton",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ToggleSkeleton {}
