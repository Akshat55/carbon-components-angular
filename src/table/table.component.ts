import {
	booleanAttribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import { NgStyle, NgTemplateOutlet } from "@angular/common";
import { Subscription } from "rxjs";
import "@carbon/web-components/es/components/data-table/index.js";
import { I18n } from "carbon-components-angular/i18n";
import { merge, TemplateSlot } from "carbon-components-angular/utils";
import { TableModel } from "./table-model.class";
import { TableHeaderItem } from "./table-header-item.class";
import { TableItem } from "./table-item.class";
import { TableRowSize } from "./table.types";
import {
	TableBody,
	TableCell,
	TableExpandedRow,
	TableHead,
	TableHeaderCell,
	TableHeaderRow,
	TableRowComponent,
	TableSortDirection
} from "./table-parts.component";

/**
 * Adds Angular inputs and outputs to the `<cds-table>` web component.
 *
 * [See demo](../../?path=/story/components-table--basic)
 *
 * ## With a `TableModel`
 *
 * The table renders the model's header and rows, and keeps the model's selection, expansion
 * and sort order in step with what the user does. Change the model to change the table.
 *
 * ```html
 * <cds-table [model]="model">
 * 	<cds-table-header-title slot="title">Servers</cds-table-header-title>
 * </cds-table>
 * ```
 *
 * ```typescript
 * model = new TableModel();
 *
 * this.model.header = [new TableHeaderItem({ data: "Name" }), new TableHeaderItem({ data: "Status" })];
 * this.model.data = [
 * 	[new TableItem({ data: "Load balancer" }), new TableItem({ data: "Active" })],
 * 	[new TableItem({ data: "Database" }), new TableItem({ data: "Disabled" })]
 * ];
 * ```
 *
 * Cells and header cells with a `template` render it with `{ data }` as context; rows with
 * `expandedData` get an expand button and render `expandedTemplate` (or the data) below them.
 *
 * Sorting: clicking a header emits `sort` with the column index. Without a `sort` listener,
 * the web component sorts the rows and the table reorders the model to match. With one, it's
 * up to the listener, e.g. to query sorted data from a backend.
 *
 * Model rows that are filtered by their header's `filter()` aren't rendered. The toolbar search
 * hides rows that don't contain the text, whatever renders them.
 *
 * ## As markup
 *
 * Without `model`, write the `cds-table-head` / `cds-table-body` yourself; the web component
 * sorts, selects, expands and filters them.
 *
 * ```html
 * <cds-table isSortable>
 * 	<cds-table-head>
 * 		<cds-table-header-row>
 * 			<cds-table-header-cell>Name</cds-table-header-cell>
 * 		</cds-table-header-row>
 * 	</cds-table-head>
 * 	<cds-table-body>
 * 		@for (server of servers; track server.id) {
 * 			<cds-table-row>
 * 				<cds-table-cell>{{ server.name }}</cds-table-cell>
 * 			</cds-table-row>
 * 		}
 * 	</cds-table-body>
 * </cds-table>
 * ```
 *
 * For a loading table use `<cds-table-skeleton>`.
 */
@Component({
	selector: "cds-table",
	template: `
		@if (model) {
			<cds-table-head>
				<cds-table-header-row [selectionLabel]="labels.CHECKBOX_HEADER">
					@for (column of model.header; track $index; let j = $index) {
						@if (showColumn(j)) {
							<cds-table-header-cell
								[attr.data-column-index]="j"
								[isSortable]="isColumnSortable(column)"
								[sortDirection]="sortDirection(column)"
								[class]="column.className"
								[ngStyle]="column.style"
								[title]="column.title">
								@if (column.hasAILabelHeader) {
									{{ headerLabel(column) }}
									<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="column.template" [cdsSlotContext]="{ data: column.data }" />
								} @else if (column.template) {
									<ng-container *ngTemplateOutlet="column.template; context: { data: column.data }" />
								} @else {
									{{ column.data }}
								}
							</cds-table-header-cell>
						}
					}
				</cds-table-header-row>
			</cds-table-head>
			<cds-table-body>
				<!-- Recreated after the web component sorts, which moves the row elements itself. -->
				@for (version of [renderVersion]; track version) {
					@for (row of rows; track row; let i = $index) {
						@if (!model.isRowFiltered(i)) {
							<cds-table-row
								[attr.data-row-index]="i"
								[selected]="!!model.isRowSelected(i)"
								[expanded]="!!model.isRowExpanded(i)"
								[disabled]="model.isRowDisabled(i)"
								[selectionName]="effectiveSelectable ? 'row-' + i : ''"
								[selectionLabel]="selectionLabel(row)"
								[class]="model.rowsClass[i]">
								@if (withRowAILabels && row[0]?.hasAILabelDecorator) {
									<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="row[0].template" [cdsSlotContext]="{ data: row[0].data }" />
								}
								@for (item of row; track $index; let j = $index) {
									@if (item && showColumn(j)) {
										<cds-table-cell
											[class]="item.cellClassName"
											[ngStyle]="model.getHeader(j)?.style"
											[title]="item.title"
											(click)="rowClick.emit(i)">
											@if (item.template) {
												<ng-container *ngTemplateOutlet="item.template; context: { data: item.data }" />
											} @else {
												{{ item.data }}
											}
										</cds-table-cell>
									}
								}
							</cds-table-row>
							@if (model.isRowExpandable(i)) {
								@if (expandAsTable(row)) {
									<!-- The expand button needs an expanded row; the data shows as rows instead. -->
									<cds-table-expanded-row style="display: none" />
									@if (model.isRowExpanded(i)) {
										@for (expandedRow of expandedData(row); track $index) {
											<cds-table-row>
												@for (item of expandedRow; track $index; let j = $index) {
													@if (item && showColumn(j)) {
														<cds-table-cell [class]="item.cellClassName" [title]="item.title">
															@if (item.template) {
																<ng-container *ngTemplateOutlet="item.template; context: { data: item.data }" />
															} @else {
																{{ item.data }}
															}
														</cds-table-cell>
													}
												}
											</cds-table-row>
										}
									}
								} @else {
									<cds-table-expanded-row>
										@if (expandedTemplate(row); as template) {
											<ng-container *ngTemplateOutlet="template; context: { data: expandedData(row) }" />
										} @else {
											{{ expandedData(row) }}
										}
									</cds-table-expanded-row>
								}
							}
						}
					}
				}
			</cds-table-body>
		}
		<ng-content />
	`,
	host: {
		"[size]": "size ?? (model ? 'md' : element.size)",
		"[useZebraStyles]": "useZebraStyles ?? (model ? true : element.useZebraStyles)",
		"[useStaticWidth]": "useStaticWidth ?? element.useStaticWidth",
		// With a model, sortable header cells are set per column: on the table, `isSortable` makes
		// the web component sort the rows right away (moving the elements Angular renders).
		"[isSortable]": "model ? false : (isSortable ?? element.isSortable)",
		"[isSelectable]": "effectiveSelectable",
		"[radio]": "radio ?? element.radio",
		"[expandable]": "model ? model.hasExpandableRows() : (expandable ?? element.expandable)",
		"[batchExpansion]": "batchExpansion ?? element.batchExpansion",
		"[withRowAILabels]": "withRowAILabels ?? element.withRowAILabels",
		"[overflowMenuOnHover]": "overflowMenuOnHover ?? element.overflowMenuOnHover",
		"[locale]": "locale ?? element.locale",
		"(cds-table-row-change-selection)": "onRowSelection($event)",
		"(cds-table-change-selection-all)": "onAllSelection($event)",
		"(cds-table-row-expando-toggled)": "onExpand($event)",
		"(cds-table-sorted)": "onSorted($event)",
		"(cds-table-filtered)": "filtered.emit($event)",
		"(cds-table-row-selected)": "rowSelected.emit($event)",
		"(cds-table-row-all-selected)": "allSelected.emit($event)"
	},
	changeDetection: ChangeDetectionStrategy.Default,
	imports: [
		NgStyle,
		NgTemplateOutlet,
		TemplateSlot,
		TableHead,
		TableHeaderRow,
		TableHeaderCell,
		TableBody,
		TableRowComponent,
		TableCell,
		TableExpandedRow
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Table {
	/**
	 * The `TableModel` to render. Without it, write the table's head and body as markup.
	 */
	@Input()
	set model(model: TableModel) {
		this.modelSubscription.unsubscribe();
		this._model = model;
		if (model) {
			this.modelSubscription = new Subscription();
			this.modelSubscription.add(model.rowsSelectedChange.subscribe(() => this.syncSelectAll()));
			this.modelSubscription.add(model.dataChange.subscribe(() => this.syncSelectAll()));
			this.syncSelectAll();
		}
	}
	get model(): TableModel {
		return this._model;
	}

	/**
	 * Row height. Defaults to `"md"` with a model and to the web component's `"lg"` without.
	 */
	@Input() size: TableRowSize;
	/**
	 * Zebra stripes. Defaults to `true` with a model.
	 */
	@Input({ transform: booleanAttribute }) useZebraStyles: boolean;
	@Input({ transform: booleanAttribute }) useStaticWidth: boolean;
	/**
	 * Lets the user sort by clicking the header cells. With a model it defaults to `true`, and
	 * columns whose `TableHeaderItem.sortable` is `false` stay unsortable.
	 */
	@Input({ transform: booleanAttribute }) isSortable: boolean;
	/**
	 * Adds a selection checkbox to every row and a select-all checkbox to the header.
	 * Defaults to `true` with a model.
	 */
	@Input({ transform: booleanAttribute }) isSelectable: boolean;
	/**
	 * Single selection with radio buttons (with `isSelectable`).
	 */
	@Input({ transform: booleanAttribute }) radio: boolean;
	/**
	 * Rows followed by a `cds-table-expanded-row` get an expand button. With a model, it's on
	 * when a row has `expandedData`.
	 */
	@Input({ transform: booleanAttribute }) expandable: boolean;
	/**
	 * Adds an expand-all button to the header (with expandable rows).
	 */
	@Input({ transform: booleanAttribute }) batchExpansion: boolean;
	/**
	 * Leaves room for AI labels on rows. With a model, the first column of rows whose first
	 * `TableItem` has `hasAILabelDecorator` renders that item's `template` as the row's AI label.
	 */
	@Input({ transform: booleanAttribute }) withRowAILabels: boolean;
	@Input({ transform: booleanAttribute }) overflowMenuOnHover: boolean;
	/**
	 * Locale used to compare cells when the web component sorts.
	 */
	@Input() locale: string;
	/**
	 * Column whose data labels each row's selection checkbox ("Select {{value}}").
	 */
	@Input() selectionLabelColumn: number;

	/**
	 * @deprecated v6 name of `isSortable`.
	 */
	@Input({ transform: booleanAttribute }) set sortable(value: boolean) {
		this.isSortable = value;
	}
	get sortable() {
		return this.isSortable ?? true;
	}
	/**
	 * @deprecated v6 name of `isSelectable`.
	 */
	@Input({ transform: booleanAttribute }) set showSelectionColumn(value: boolean) {
		this.isSelectable = value;
	}
	get showSelectionColumn() {
		return this.effectiveSelectable;
	}
	/**
	 * @deprecated v6 name of `radio`.
	 */
	@Input({ transform: booleanAttribute }) set enableSingleSelect(value: boolean) {
		this.radio = value;
	}
	get enableSingleSelect() {
		return !!this.radio;
	}
	/**
	 * @deprecated v6 name of `useZebraStyles`.
	 */
	@Input({ transform: booleanAttribute }) set striped(value: boolean) {
		this.useZebraStyles = value;
	}
	get striped() {
		return this.useZebraStyles ?? !!this.model;
	}
	/**
	 * @deprecated v6 name of `batchExpansion`.
	 */
	@Input({ transform: booleanAttribute }) set showExpandAllToggle(value: boolean) {
		this.batchExpansion = value;
	}
	get showExpandAllToggle() {
		return !!this.batchExpansion;
	}

	/**
	 * Expects an object that contains some or all of:
	 * ```
	 * {
	 *		"CHECKBOX_HEADER": "Select all rows",
	 *		"CHECKBOX_ROW": "Select {{value}}"
	 * }
	 * ```
	 */
	@Input()
	set translations(value: Partial<Record<"CHECKBOX_HEADER" | "CHECKBOX_ROW", string>>) {
		this.labels = merge({}, this.i18n.get().TABLE, value);
	}

	/**
	 * With a model: emits the index of the header the user clicked.
	 *
	 * Without a listener, the web component sorts the rows (comparing their text, using
	 * `locale`) and the table puts the model's rows and header sort state in the same order.
	 * With a listener, the web component doesn't sort and it's up to the listener, as in v1
	 * (e.g. to query sorted data from a backend): update the header's `sorted`/`sortDirection`
	 * and the data.
	 */
	@Output() sort = new EventEmitter<number>();
	/**
	 * With a model: emits the model when the user selects every row.
	 */
	@Output() selectAll = new EventEmitter<TableModel>();
	/**
	 * With a model: emits the model when the user deselects every row.
	 */
	@Output() deselectAll = new EventEmitter<TableModel>();
	/**
	 * With a model: emits `{ model, selectedRowIndex }` when the user selects a row.
	 */
	@Output() selectRow = new EventEmitter<{ model: TableModel, selectedRowIndex: number }>();
	/**
	 * With a model: emits `{ model, deselectedRowIndex }` when the user deselects a row.
	 */
	@Output() deselectRow = new EventEmitter<{ model: TableModel, deselectedRowIndex: number }>();
	/**
	 * With a model: emits the index of the row whose cell the user clicked.
	 */
	@Output() rowClick = new EventEmitter<number>();
	/**
	 * Emits the `cds-table-sorted` event (`detail.sortedHeader`) after the web component sorted its rows.
	 */
	@Output() sorted = new EventEmitter<CustomEvent>();
	/**
	 * Emits the `cds-table-filtered` event (`detail.unfilteredRows`) after a toolbar search.
	 */
	@Output() filtered = new EventEmitter<CustomEvent>();
	/**
	 * Emits the `cds-table-row-selected` event (`detail.selectedRow`).
	 */
	@Output() rowSelected = new EventEmitter<CustomEvent>();
	/**
	 * Emits the `cds-table-row-all-selected` event (`detail.selectedRows`).
	 */
	@Output() allSelected = new EventEmitter<CustomEvent>();
	/**
	 * Emits the `cds-table-row-expando-toggled` event (`detail.expanded`) of a row or of the expand-all button.
	 */
	@Output() rowExpanded = new EventEmitter<CustomEvent>();

	protected i18n = inject(I18n);
	protected labels: Record<string, string> = { ...this.i18n.get().TABLE };
	protected element = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);
	protected _model: TableModel;
	protected modelSubscription = new Subscription();
	protected syncScheduled = false;
	/**
	 * Bumped to re-render the rows from the model after the web component sorted them.
	 */
	protected renderVersion = 0;
	protected pendingSort: { index: number, direction: TableSortDirection } | null = null;

	constructor() {
		// Capture phase, so the table can stop the event before the web component sorts.
		const onSort = (event: CustomEvent) => this.onSort(event);
		this.element.addEventListener("cds-table-header-cell-sort", onSort, true);
		inject(DestroyRef).onDestroy(() => {
			this.element.removeEventListener("cds-table-header-cell-sort", onSort, true);
			this.modelSubscription.unsubscribe();
		});
	}

	get rows(): TableItem[][] {
		const data = this.model.data;
		return data.length === 1 && data[0].length === 0 ? [] : data;
	}

	get effectiveSelectable(): boolean {
		return this.isSelectable ?? (this.model ? true : this.element.isSelectable);
	}

	showColumn(index: number): boolean {
		if (this.withRowAILabels && index === 0) {
			return false;
		}
		const header = this.model.header[index];
		return !header || header.visible;
	}

	isColumnSortable(column: TableHeaderItem): boolean {
		return (this.isSortable ?? true) && column.sortable;
	}

	/**
	 * Text of a header whose template is its AI label: `data` itself, or `data.label`.
	 */
	headerLabel(column: TableHeaderItem): string {
		const data = column.data;
		return typeof data === "string" ? data : (data?.label ?? "");
	}

	sortDirection(column: TableHeaderItem): TableSortDirection {
		if (!column.sorted) {
			return "none";
		}
		return column.descending ? "descending" : "ascending";
	}

	selectionLabel(row: TableItem[]): string {
		const item = this.selectionLabelColumn == null ? null : row[this.selectionLabelColumn];
		const value = item && typeof item.data === "string" ? item.data : this.labels.ROW;
		return this.labels.CHECKBOX_ROW.replace("{{value}}", value);
	}

	expandAsTable(row: TableItem[]): boolean {
		return row.some(item => item?.expandAsTable);
	}

	expandedData(row: TableItem[]) {
		return row.find(item => item?.expandedData)?.expandedData;
	}

	expandedTemplate(row: TableItem[]) {
		return row.find(item => item?.expandedTemplate)?.expandedTemplate;
	}

	protected onSort(event: CustomEvent<{ sortDirection: TableSortDirection }>) {
		const cell = (event.target as Element).closest?.("cds-table-header-cell[data-column-index]");
		if (!this.model || !cell || cell.closest("cds-table") !== this.element) {
			return;
		}
		const index = Number(cell.getAttribute("data-column-index"));
		if (this.sort.observed) {
			// The listener sorts (v1): the web component neither sorts nor changes the direction,
			// which is bound from the model.
			event.preventDefault();
			event.stopPropagation();
			this.sort.emit(index);
			return;
		}
		// The web component sorts; `onSorted` puts the model in the same order.
		this.pendingSort = { index, direction: event.detail.sortDirection };
	}

	protected onSorted(event: CustomEvent) {
		this.sorted.emit(event);
		const pending = this.pendingSort;
		this.pendingSort = null;
		if (!pending || !this.model) {
			return;
		}
		const model = this.model;
		const body = this.element.querySelector(":scope > cds-table-body");
		const rendered = Array.from<Element>(body?.children ?? [])
			.filter(row => row.matches("cds-table-row[data-row-index]"))
			.map(row => Number(row.getAttribute("data-row-index")));
		const order = [...rendered, ...model.data.map((_, i) => i).filter(i => !rendered.includes(i))];

		// Moves each row's selected / expanded / class state with it.
		model.pushRowStateToModelData();
		const rows = order.map(i => model.data[i]);
		model.data.splice(0, rows.length, ...rows);
		model.popRowStateFromModelData();

		model.header.forEach(column => {
			if (column) {
				column.sorted = false;
			}
		});
		const header = model.header[pending.index];
		if (header) {
			header.sorted = pending.direction !== "none";
			const directions = { ascending: "ASCENDING", descending: "DESCENDING", none: "NONE" } as const;
			header.sortDirection = directions[pending.direction] ?? "NONE";
		}
		this.renderVersion++;
		this.sort.emit(pending.index);
		this.changeDetectorRef.markForCheck();
	}

	protected onRowSelection(event: CustomEvent<{ selected: boolean }>) {
		const index = this.rowIndex(event.target as Element);
		if (index === null) {
			return;
		}
		const { selected } = event.detail;
		if (selected) {
			if (this.element.radio) {
				this.model.selectAll(false);
			}
			this.model.selectRow(index, true);
			this.selectRow.emit({ model: this.model, selectedRowIndex: index });
		} else {
			this.model.selectRow(index, false);
			this.deselectRow.emit({ model: this.model, deselectedRowIndex: index });
		}
	}

	protected onAllSelection(event: CustomEvent<{ selected: boolean }>) {
		if (!this.model || (event.target as Element).closest("cds-table") !== this.element) {
			return;
		}
		this.model.selectAll(event.detail.selected);
		(event.detail.selected ? this.selectAll : this.deselectAll).emit(this.model);
	}

	protected onExpand(event: CustomEvent<{ expanded: boolean }>) {
		this.rowExpanded.emit(event);
		const target = event.target as Element;
		if (!this.model || target.closest("cds-table") !== this.element) {
			return;
		}
		if (target.tagName === "CDS-TABLE-HEADER-ROW") {
			this.model.expandAllRows(event.detail.expanded);
		} else {
			const index = this.rowIndex(target);
			if (index !== null) {
				this.model.expandRow(index, event.detail.expanded);
			}
		}
	}

	protected rowIndex(element: Element): number | null {
		if (!this.model || element.closest("cds-table") !== this.element || !element.hasAttribute("data-row-index")) {
			return null;
		}
		return Number(element.getAttribute("data-row-index"));
	}

	/**
	 * The web component only updates the select-all checkbox when the user selects rows;
	 * show selections made through the model too.
	 */
	protected syncSelectAll() {
		if (this.syncScheduled) {
			return;
		}
		this.syncScheduled = true;
		queueMicrotask(async () => {
			this.syncScheduled = false;
			const model = this.model;
			const headerRow = this.element.querySelector(":scope > cds-table-head > cds-table-header-row");
			if (!model || !headerRow) {
				return;
			}
			await headerRow.updateComplete;
			const checkbox = headerRow.shadowRoot?.querySelector("cds-checkbox");
			if (!checkbox) {
				return;
			}
			const rows = this.rows.map((_, i) => i).filter(i => !model.isRowDisabled(i) && !model.isRowFiltered(i));
			const selected = rows.filter(i => model.isRowSelected(i)).length;
			checkbox.checked = selected > 0;
			checkbox.indeterminate = selected > 0 && selected < rows.length;
		});
	}
}
