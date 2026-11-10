import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import "@carbon/web-components/es/components/structured-list/index.js";

/**
 * The `<cds-structured-list-head>` web component. Holds a `cds-structured-list-header-row`.
 */
@Component({
	selector: "cds-structured-list-head",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListHeader {}

/**
 * The `<cds-structured-list-header-row>` web component. Holds `cds-structured-list-header-cell`s.
 */
@Component({
	selector: "cds-structured-list-header-row",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListHeaderRow {}
