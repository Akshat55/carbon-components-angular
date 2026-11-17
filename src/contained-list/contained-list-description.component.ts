import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import "@carbon/web-components/es/components/contained-list/index.js";

/**
 * Secondary text of a `cds-contained-list-item`.
 *
 * Angular class for the `<cds-contained-list-description>` web component, so templates can use it without
 * `CUSTOM_ELEMENTS_SCHEMA`. Importing it registers the web component.
 */
@Component({
	selector: "cds-contained-list-description",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContainedListDescription {}
