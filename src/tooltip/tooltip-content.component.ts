import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import "@carbon/web-components/es/components/tooltip/index.js";

/**
 * The content of a `cds-tooltip`, when written as a child instead of passed in `description`.
 *
 * Angular class for the `<cds-tooltip-content>` web component, so templates can use it without
 * `CUSTOM_ELEMENTS_SCHEMA`. Importing it registers the web component.
 */
@Component({
	selector: "cds-tooltip-content",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TooltipContent {}
