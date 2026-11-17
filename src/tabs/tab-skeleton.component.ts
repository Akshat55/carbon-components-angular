import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/tabs/index.js";

/**
 * The `<cds-tab-skeleton>` web component: one tab in a `cds-tabs-skeleton`.
 */
@Component({
	selector: "cds-tab-skeleton",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabItemSkeleton {}

/**
 * The `<cds-tabs-skeleton>` web component. Project `cds-tab-skeleton`s, or set `numOfTabs`.
 *
 * ```html
 * <cds-tabs-skeleton [numOfTabs]="5" />
 * ```
 */
@Component({
	selector: "cds-tabs-skeleton",
	template: `
		<ng-content />
		@for (tab of tabs; track $index) {
			<cds-tab-skeleton />
		}
	`,
	host: {
		"[contained]": "contained"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TabItemSkeleton],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabSkeleton {
	/**
	 * Number of `cds-tab-skeleton`s to render.
	 */
	@Input() set numOfTabs(count: number) {
		this.tabs = new Array(count ?? 0);
	}
	/**
	 * @deprecated use `numOfTabs`.
	 */
	@Input() set numOftabs(count: number) {
		this.numOfTabs = count;
	}
	@Input({ transform: booleanAttribute }) contained = false;

	protected tabs: unknown[] = [];
}
