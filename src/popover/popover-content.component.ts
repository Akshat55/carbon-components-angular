import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import "@carbon/web-components/es/components/popover/index.js";

/**
 * Wraps the `<cds-popover-content>` web component. Use inside `cds-popover`.
 */
@Component({
	selector: "cds-popover-content",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PopoverContent {}
