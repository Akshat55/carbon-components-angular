import {
	booleanAttribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/data-table/index.js";
import { I18n } from "carbon-components-angular/i18n";
import { observeAttributes, provideValueAccessor, WebComponentValueAccessor } from "carbon-components-angular/utils";
import { TableModel } from "./table-model.class";

export type TableSortDirection = "none" | "ascending" | "descending";

/**
 * Angular class for the `<cds-table-head>` web component. Holds a `cds-table-header-row`.
 */
@Component({
	selector: "cds-table-head",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableHead {}

/**
 * Adds Angular inputs to the `<cds-table-header-row>` web component.
 *
 * The table gives it the select-all checkbox (`isSelectable` on `cds-table`) and the
 * expand-all button (`batchExpansion` on `cds-table`).
 */
@Component({
	selector: "cds-table-header-row",
	template: "<ng-content />",
	host: {
		"[selected]": "selected ?? element.selected",
		"[selectionLabel]": "selectionLabel ?? element.selectionLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableHeaderRow {
	/**
	 * State of the select-all checkbox.
	 */
	@Input({ transform: booleanAttribute }) selected: boolean;
	/**
	 * Label of the select-all checkbox.
	 */
	@Input() selectionLabel: string;

	protected element = inject(ElementRef).nativeElement;
}

/**
 * Adds Angular inputs and outputs to the `<cds-table-header-cell>` web component. Supports `[(sortDirection)]`.
 *
 * ```html
 * <cds-table-header-cell isSortable [(sortDirection)]="direction">Name</cds-table-header-cell>
 * ```
 */
@Component({
	selector: "cds-table-header-cell",
	template: "<ng-content />",
	host: {
		"[isSortable]": "isSortable ?? element.isSortable",
		"[sortDirection]": "sortDirection ?? element.sortDirection",
		"[sortCycle]": "sortCycle ?? element.sortCycle"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableHeaderCell {
	/**
	 * Unset, the column follows `isSortable` on `cds-table`.
	 */
	@Input({ transform: booleanAttribute }) isSortable: boolean;
	@Input() sortDirection: TableSortDirection;
	/**
	 * `"tri-states-from-ascending"` (default), `"tri-states-from-descending"`,
	 * `"bi-states-from-ascending"` or `"bi-states-from-descending"`.
	 */
	@Input() sortCycle: string;

	@Output() sortDirectionChange = new EventEmitter<TableSortDirection>();

	protected element = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		observeAttributes(this.element, ["sort-direction"], () => {
			const direction = this.element.sortDirection;
			if (direction !== this.sortDirection) {
				this.sortDirection = direction;
				this.sortDirectionChange.emit(direction);
				this.changeDetectorRef.markForCheck();
			}
		});
	}
}

/**
 * Angular class for the `<cds-table-body>` web component. Holds the `cds-table-row`s.
 */
@Component({
	selector: "cds-table-body",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableBody {}

/**
 * Adds Angular inputs and outputs to the `<cds-table-row>` web component. Supports `[(selected)]` and `[(expanded)]`.
 *
 * The row gets a selection checkbox (or radio, with `radio` on `cds-table`) when the table is
 * `isSelectable`, and an expand button when a `cds-table-expanded-row` follows it in an `expandable` table.
 */
@Component({
	selector: "cds-table-row",
	template: "<ng-content />",
	host: {
		"[selected]": "selected ?? element.selected",
		"[expanded]": "expanded ?? element.expanded",
		"[disabled]": "disabled ?? element.disabled",
		"[selectionName]": "selectionName ?? element.selectionName",
		"[selectionValue]": "selectionValue ?? element.selectionValue",
		"[selectionLabel]": "selectionLabel ?? element.selectionLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableRowComponent {
	@Input({ transform: booleanAttribute }) selected: boolean;
	@Input({ transform: booleanAttribute }) expanded: boolean;
	@Input({ transform: booleanAttribute }) disabled: boolean;
	/**
	 * Name of the selection checkbox. Unset, a selectable table numbers the rows.
	 */
	@Input() selectionName: string;
	@Input() selectionValue: string;
	/**
	 * Label of the selection checkbox.
	 */
	@Input() selectionLabel: string;

	@Output() selectedChange = new EventEmitter<boolean>();
	@Output() expandedChange = new EventEmitter<boolean>();

	protected element = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		// The row, and the table (select all, expand all), change these themselves.
		observeAttributes(this.element, ["selected", "expanded"], name => {
			if (name === "selected" && this.element.selected !== !!this.selected) {
				this.selected = this.element.selected;
				this.selectedChange.emit(this.selected);
			} else if (name === "expanded" && this.element.expanded !== !!this.expanded) {
				this.expanded = this.element.expanded;
				this.expandedChange.emit(this.expanded);
			}
			this.changeDetectorRef.markForCheck();
		});
	}
}

/**
 * Angular class for the `<cds-table-cell>` web component.
 */
@Component({
	selector: "cds-table-cell",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableCell {}

/**
 * Angular class for the `<cds-table-expanded-row>` web component. Place it right after its `cds-table-row`;
 * the row opens and closes it.
 */
@Component({
	selector: "cds-table-expanded-row",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableExpandedRow {}

/**
 * Angular class for the `<cds-table-header-title>` web component. Use `slot="title"` inside `cds-table`.
 */
@Component({
	selector: "cds-table-header-title",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableHeaderTitle {}

/**
 * Angular class for the `<cds-table-header-description>` web component. Use `slot="description"` inside `cds-table`.
 */
@Component({
	selector: "cds-table-header-description",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableHeaderDescription {}

/**
 * Adds Angular inputs to the `<cds-table-toolbar>` web component. Use `slot="toolbar"` inside `cds-table`,
 * with a `cds-table-batch-actions` and a `cds-table-toolbar-content`.
 */
@Component({
	selector: "cds-table-toolbar",
	template: "<ng-content />",
	host: {
		"[size]": "size ?? element.size"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableToolbar {
	/**
	 * Unset, follows the table's `size`.
	 */
	@Input() size: "xs" | "sm" | "lg";

	protected element = inject(ElementRef).nativeElement;
}

/**
 * Angular class for the `<cds-table-toolbar-content>` web component. Holds the toolbar search and buttons;
 * hidden while the batch actions show.
 */
@Component({
	selector: "cds-table-toolbar-content",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableToolbarContent {}

/**
 * Adds Angular inputs and outputs to the `<cds-table-toolbar-search>` web component. Works with `ngModel` / reactive forms.
 *
 * The table hides the rows that don't contain the text (it sets `filtered` on them).
 */
@Component({
	selector: "cds-table-toolbar-search",
	template: "",
	host: {
		"[value]": "value ?? ''",
		"[expanded]": "expanded",
		"[persistent]": "persistent",
		"[placeholder]": "placeholder",
		"[labelText]": "label",
		"[closeButtonLabelText]": "clearButtonTitle",
		"[size]": "size ?? element.size",
		"[disabled]": "disabled ?? element.disabled",
		"(cds-search-input)": "onSearch($event)"
	},
	providers: [provideValueAccessor(() => TableToolbarSearch)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableToolbarSearch extends WebComponentValueAccessor<string> {
	public i18n = inject(I18n);

	@Input() value = "";
	/**
	 * Whether the search is open. Supports `[(expanded)]`.
	 */
	@Input({ transform: booleanAttribute }) expanded = false;
	/**
	 * Keeps the search open.
	 */
	@Input({ transform: booleanAttribute }) persistent = false;
	@Input() placeholder = this.i18n.get().SEARCH.PLACEHOLDER;
	@Input() label = this.i18n.get().SEARCH.LABEL;
	@Input() clearButtonTitle = this.i18n.get().SEARCH.CLEAR_BUTTON;
	@Input() size: "sm" | "md" | "lg";

	@Output() valueChange = new EventEmitter<string>();
	@Output() expandedChange = new EventEmitter<boolean>();

	constructor() {
		super();
		observeAttributes(this.element, ["expanded"], () => {
			if (this.element.expanded !== this.expanded) {
				this.expanded = this.element.expanded;
				this.expandedChange.emit(this.expanded);
				this.changeDetectorRef.markForCheck();
			}
		});
	}

	writeValue(value: string) {
		this.value = value;
		this.changeDetectorRef.markForCheck();
	}

	onSearch(event: Event) {
		this.value = (event as CustomEvent<{ value: string }>).detail.value;
		this.onChange(this.value);
		this.valueChange.emit(this.value);
	}
}

/**
 * Adds Angular inputs and outputs to the `<cds-table-batch-actions>` web component. Project the action buttons.
 *
 * The table shows it and counts the rows as the user selects them. With `model`, it follows the
 * model's selection instead (including selections made in code).
 *
 * ```html
 * <cds-table-toolbar slot="toolbar">
 * 	<cds-table-batch-actions [model]="model">
 * 		<cds-button>Delete</cds-button>
 * 	</cds-table-batch-actions>
 * 	<cds-table-toolbar-content>
 * 		<cds-table-toolbar-search />
 * 	</cds-table-toolbar-content>
 * </cds-table-toolbar>
 * ```
 */
@Component({
	selector: "cds-table-batch-actions",
	template: "<ng-content />",
	host: {
		"[active]": "model ? model.selectedRowsCount() > 0 : (active ?? element.active)",
		"[selectedRowsCount]": "model ? model.selectedRowsCount() : (selectedRowsCount ?? element.selectedRowsCount)",
		"[totalRowsCount]": "model ? model.data.length : (totalRowsCount ?? element.totalRowsCount)",
		"[formatSelectedItemsCount]": "formatSelectedItemsCount ?? element.formatSelectedItemsCount",
		"(cds-table-batch-actions-cancel-clicked)": "onCancel()",
		"(cds-table-batch-actions-select-all-clicked)": "onSelectAll()"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableBatchActions {
	/**
	 * The `TableModel` whose selection the batch actions show. Cancel deselects its rows.
	 */
	@Input() model: TableModel;
	@Input({ transform: booleanAttribute }) active: boolean;
	@Input() selectedRowsCount: number;
	@Input() totalRowsCount: number;
	/**
	 * Formats the selection summary, e.g. `({ count }) => \`${count} selected\``.
	 */
	@Input() formatSelectedItemsCount: (options: { count: number }) => string;

	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() cancel = new EventEmitter<void>();
	@Output() selectAll = new EventEmitter<void>();

	protected element = inject(ElementRef).nativeElement;

	onCancel() {
		this.model?.selectAll(false);
		this.cancel.emit();
	}

	onSelectAll() {
		this.model?.selectAll(true);
		this.selectAll.emit();
	}
}

/**
 * Loading state of a table.
 *
 * Adds Angular inputs to the `<cds-table-skeleton>` web component.
 */
@Component({
	selector: "cds-table-skeleton",
	template: "",
	host: {
		"[columnCount]": "columnCount ?? element.columnCount",
		"[rowCount]": "rowCount ?? element.rowCount",
		"[headers]": "headers ?? element.headers",
		"[showHeader]": "showHeader ?? element.showHeader",
		"[showToolbar]": "showToolbar ?? element.showToolbar",
		"[zebra]": "zebra ?? element.zebra"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableSkeleton {
	@Input() columnCount: number;
	@Input() rowCount: number;
	/**
	 * Header labels; also sets the column count.
	 */
	@Input() headers: string[];
	@Input({ transform: booleanAttribute }) showHeader: boolean;
	@Input({ transform: booleanAttribute }) showToolbar: boolean;
	@Input({ transform: booleanAttribute }) zebra: boolean;

	protected element = inject(ElementRef).nativeElement;
}
