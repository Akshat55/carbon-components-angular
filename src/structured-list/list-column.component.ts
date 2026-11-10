import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/structured-list/index.js";

/**
 * Adds `nowrap` to the `<cds-structured-list-cell>` web component.
 */
@Component({
	selector: "cds-structured-list-cell",
	template: "<ng-content />",
	host: {
		"[class.cds--structured-list-content--nowrap]": "nowrap"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListColumn {
	@Input() nowrap = false;
}

/**
 * The `<cds-structured-list-header-cell>` web component.
 */
@Component({
	selector: "cds-structured-list-header-cell",
	template: "<ng-content />",
	host: {
		"[class.cds--structured-list-content--nowrap]": "nowrap"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListHeaderColumn {
	@Input() nowrap = false;
}

/**
 * The `<cds-structured-list-header-cell-skeleton>` web component.
 */
@Component({
	selector: "cds-structured-list-header-cell-skeleton",
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListHeaderColumnSkeleton {}
