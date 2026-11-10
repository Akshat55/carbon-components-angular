import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output
} from "@angular/core";
import "@carbon/web-components/es/components/data-table/index.js";

/**
 * Wraps the `<cds-table>` web component. Tables are written as markup: use `@for` to render rows.
 *
 * ```html
 * <cds-table [isSortable]="true" [isSelectable]="true" (sorted)="onSort($event)">
 * 	<cds-table-header-title slot="title">Servers</cds-table-header-title>
 * 	<cds-table-head>
 * 		<cds-table-header-row>
 * 			<cds-table-header-cell>Name</cds-table-header-cell>
 * 		</cds-table-header-row>
 * 	</cds-table-head>
 * 	<cds-table-body>
 * 		@for (row of rows; track row.id) {
 * 			<cds-table-row [selectionName]="row.id">
 * 				<cds-table-cell>{{ row.name }}</cds-table-cell>
 * 			</cds-table-row>
 * 		}
 * 	</cds-table-body>
 * </cds-table>
 * ```
 *
 * Import this from `carbon-components-angular/table-v2`. It registers the `cds-table*` web components,
 * so in the same app use the v1 table with its `ibm-table` / `ibm-table-toolbar*` selectors.
 */
@Component({
	selector: "cds-table",
	template: "<ng-content />",
	host: {
		"[size]": "size",
		"[useZebraStyles]": "useZebraStyles",
		"[useStaticWidth]": "useStaticWidth",
		"[isSortable]": "isSortable",
		"[isSelectable]": "isSelectable",
		"[radio]": "radio",
		"[expandable]": "expandable",
		"[batchExpansion]": "batchExpansion",
		"[overflowMenuOnHover]": "overflowMenuOnHover",
		"[locale]": "locale",
		"(cds-table-sorted)": "sorted.emit($event)",
		"(cds-table-filtered)": "filtered.emit($event)",
		"(cds-table-row-selected)": "rowSelected.emit($event)",
		"(cds-table-row-all-selected)": "allSelected.emit($event)",
		"(cds-table-row-expando-toggled)": "rowExpanded.emit($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2 {
	@Input() size: "xs" | "sm" | "md" | "lg" | "xl" = "lg";
	@Input() useZebraStyles = false;
	@Input() useStaticWidth = false;
	@Input() isSortable = false;
	@Input() isSelectable = false;
	/**
	 * Single selection with radio buttons (with `isSelectable`).
	 */
	@Input() radio = false;
	@Input() expandable = false;
	/**
	 * Adds an expand-all button to the header (with `expandable`).
	 */
	@Input() batchExpansion = false;
	@Input() overflowMenuOnHover = true;
	@Input() locale = "en";

	/**
	 * Emits the `cds-table-sorted` event (`detail.sortedHeader`, `detail.sortDirection`).
	 */
	@Output() sorted = new EventEmitter<CustomEvent>();
	/**
	 * Emits the `cds-table-filtered` event after a toolbar search.
	 */
	@Output() filtered = new EventEmitter<CustomEvent>();
	/**
	 * Emits the `cds-table-row-selected` event (`detail.selectedRow`).
	 */
	@Output() rowSelected = new EventEmitter<CustomEvent>();
	/**
	 * Emits the `cds-table-row-all-selected` event (`detail.selected`).
	 */
	@Output() allSelected = new EventEmitter<CustomEvent>();
	/**
	 * Emits the `cds-table-row-expando-toggled` event (`detail.expanded`).
	 */
	@Output() rowExpanded = new EventEmitter<CustomEvent>();
}

/**
 * Wraps `<cds-table-head>`.
 */
@Component({
	selector: "cds-table-head",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2Head {}

/**
 * Wraps `<cds-table-header-row>`.
 */
@Component({
	selector: "cds-table-header-row",
	template: "<ng-content />",
	host: {
		"[selected]": "selected"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2HeaderRow {
	/**
	 * State of the select-all checkbox.
	 */
	@Input() selected = false;
}

/**
 * Wraps `<cds-table-header-cell>`. Supports `[(sortDirection)]`.
 */
@Component({
	selector: "cds-table-header-cell",
	template: "<ng-content />",
	host: {
		"[isSortable]": "isSortable",
		"[sortDirection]": "sortDirection",
		"[sortCycle]": "sortCycle",
		"(cds-table-header-cell-sort)": "onSort($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2HeaderCell {
	@Input() isSortable: boolean;
	@Input() sortDirection: "none" | "ascending" | "descending";
	@Input() sortCycle: string;

	@Output() sortDirectionChange = new EventEmitter<"none" | "ascending" | "descending">();

	onSort(event: Event) {
		if (event.target === event.currentTarget) {
			this.sortDirection = (event as CustomEvent<{ sortDirection: any }>).detail.sortDirection;
			this.sortDirectionChange.emit(this.sortDirection);
		}
	}
}

/**
 * Wraps `<cds-table-body>`.
 */
@Component({
	selector: "cds-table-body",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2Body {}

/**
 * Wraps `<cds-table-row>`. Supports `[(selected)]` and `[(expanded)]`.
 */
@Component({
	selector: "cds-table-row",
	template: "<ng-content />",
	host: {
		"[selected]": "selected",
		"[expanded]": "expanded",
		"[disabled]": "disabled",
		"[selectionName]": "selectionName",
		"[selectionValue]": "selectionValue",
		"[selectionLabel]": "selectionLabel",
		"(cds-table-row-change-selection)": "onSelection($event)",
		"(cds-table-row-expando-toggled)": "onExpanded($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2Row {
	@Input() selected = false;
	@Input() expanded = false;
	@Input() disabled = false;
	/**
	 * Name of the row's selection checkbox / radio (set it to make the row selectable).
	 */
	@Input() selectionName: string;
	@Input() selectionValue: string;
	@Input() selectionLabel: string;

	@Output() selectedChange = new EventEmitter<boolean>();
	@Output() expandedChange = new EventEmitter<boolean>();

	onSelection(event: Event) {
		if (event.target === event.currentTarget) {
			this.selected = (event as CustomEvent<{ selected: boolean }>).detail.selected;
			this.selectedChange.emit(this.selected);
		}
	}

	onExpanded(event: Event) {
		if (event.target === event.currentTarget) {
			this.expanded = (event as CustomEvent<{ expanded: boolean }>).detail.expanded;
			this.expandedChange.emit(this.expanded);
		}
	}
}

/**
 * Wraps `<cds-table-cell>`.
 */
@Component({
	selector: "cds-table-cell",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2Cell {}

/**
 * Wraps `<cds-table-expanded-row>`; place it right after its `cds-table-row`.
 */
@Component({
	selector: "cds-table-expanded-row",
	template: "<ng-content />",
	host: {
		"[colSpan]": "colSpan"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2ExpandedRow {
	@Input() colSpan: number;
}

/**
 * Wraps `<cds-table-header-title>` (use `slot="title"`).
 */
@Component({
	selector: "cds-table-header-title",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2HeaderTitle {}

/**
 * Wraps `<cds-table-header-description>` (use `slot="description"`).
 */
@Component({
	selector: "cds-table-header-description",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2HeaderDescription {}

/**
 * Wraps `<cds-table-toolbar>` (use `slot="toolbar"`).
 */
@Component({
	selector: "cds-table-toolbar",
	template: "<ng-content />",
	host: {
		"[size]": "size"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2Toolbar {
	@Input() size: "sm" | "md" | "lg" = "lg";
}

/**
 * Wraps `<cds-table-toolbar-content>`.
 */
@Component({
	selector: "cds-table-toolbar-content",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2ToolbarContent {}

/**
 * Wraps `<cds-table-toolbar-search>`. The table filters its rows as the user types;
 * `valueChange` emits the text.
 */
@Component({
	selector: "cds-table-toolbar-search",
	template: "",
	host: {
		"[expanded]": "expanded",
		"[persistent]": "persistent",
		"[placeholder]": "placeholder",
		"(cds-search-input)": "valueChange.emit($any($event).detail.value)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2ToolbarSearch {
	@Input() expanded = false;
	/**
	 * Keeps the search open.
	 */
	@Input() persistent = false;
	@Input() placeholder = "Filter table";

	@Output() valueChange = new EventEmitter<string>();
}

/**
 * Wraps `<cds-table-batch-actions>`; shown while rows are selected.
 */
@Component({
	selector: "cds-table-batch-actions",
	template: "<ng-content />",
	host: {
		"[active]": "active",
		"[selectedRowsCount]": "selectedRowsCount",
		"[totalRowsCount]": "totalRowsCount",
		"(cds-table-batch-actions-cancel-clicked)": "cancel.emit()",
		"(cds-table-batch-actions-select-all-clicked)": "selectAll.emit()"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2BatchActions {
	@Input() active = false;
	@Input() selectedRowsCount = 0;
	@Input() totalRowsCount = 0;

	@Output() cancel = new EventEmitter<void>();
	@Output() selectAll = new EventEmitter<void>();
}

/**
 * Wraps `<cds-table-skeleton>`.
 */
@Component({
	selector: "cds-table-skeleton",
	template: "",
	host: {
		"[columnCount]": "columnCount",
		"[rowCount]": "rowCount",
		"[showHeader]": "showHeader",
		"[showToolbar]": "showToolbar",
		"[zebra]": "zebra"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableV2Skeleton {
	@Input() columnCount = 5;
	@Input() rowCount = 5;
	@Input() showHeader = true;
	@Input() showToolbar = true;
	@Input() zebra = false;
}
