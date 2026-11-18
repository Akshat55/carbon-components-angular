import { Component, TemplateRef, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TableModel } from "./table-model.class";
import { Table } from "./table.component";
import { TableModule } from "./table.module";
import { TableHeaderItem } from "./table-header-item.class";
import { TableItem } from "./table-item.class";
import { TableRow } from "./table-row.class";
import { settle, shadow } from "../test-helpers/web-components";

/** The native checkbox of a row's (or the header row's) selection `cds-checkbox`. */
const rowCheckbox = (row: Element) => shadow<HTMLInputElement>(shadow(row, "cds-checkbox"), "input");

@Component({
	template: `
		<cds-table
			[model]="model"
			[isSelectable]="isSelectable"
			[radio]="radio"
			[withRowAILabels]="withRowAILabels"
			[selectionLabelColumn]="selectionLabelColumn"
			(sort)="onSort($event)"
			(selectRow)="onSelect($event)"
			(deselectRow)="onSelect($event)"
			(rowClick)="clicked = $event">
			<cds-table-header-title slot="title">Servers</cds-table-header-title>
		</cds-table>
		<ng-template #cell let-data="data"><b class="custom">{{ data.name }}</b></ng-template>
		<ng-template #expanded let-data="data"><i class="expanded">{{ data }}</i></ng-template>
		<ng-template #aiLabel><span class="ai-label">AI</span></ng-template>
	`,
	imports: [TableModule]
})
class TableTest {
	@ViewChild("cell", { static: true }) cell: TemplateRef<any>;
	@ViewChild("expanded", { static: true }) expanded: TemplateRef<any>;
	@ViewChild("aiLabel", { static: true }) aiLabel: TemplateRef<any>;
	model = new TableModel();
	isSelectable = true;
	radio = false;
	withRowAILabels = false;
	selectionLabelColumn: number;
	clicked: number;

	constructor() {
		this.model.header = [new TableHeaderItem({ data: "Column" }), new TableHeaderItem({ data: "Other", sortable: false })];
		this.model.data = [
			[new TableItem({ data: "0" }), new TableItem({ data: "a" })],
			[new TableItem({ data: "3" }), new TableItem({ data: "b" })],
			[new TableItem({ data: "1" }), new TableItem({ data: "c" })],
			[new TableItem({ data: "2" }), new TableItem({ data: "d" })]
		];
	}

	onSort(_index: number) {}
	onSelect(_event: object) {}
}

@Component({
	template: `<cds-table [model]="model" />`,
	imports: [TableModule]
})
class DefaultSortTest {
	model = new TableModel();

	constructor() {
		this.model.header = [new TableHeaderItem({ data: "Column" })];
		this.model.data = [[new TableItem({ data: "b" })], [new TableItem({ data: "c" })], [new TableItem({ data: "a" })]];
	}
}

@Component({
	template: `
		<cds-table
			[model]="model"
			[sortable]="false"
			[showSelectionColumn]="true"
			[enableSingleSelect]="true"
			[striped]="false"
			[showExpandAllToggle]="true" />
	`,
	imports: [TableModule]
})
class AliasTest {
	model = new TableModel();

	constructor() {
		this.model.header = [new TableHeaderItem({ data: "Column" })];
		this.model.data = [[new TableItem({ data: "a" })]];
	}
}

describe("Table", () => {
	let fixture: ComponentFixture<TableTest>;
	let table: any;
	let model: TableModel;

	const bodyRows = (): any[] => Array.from(table.querySelectorAll(":scope > cds-table-body > cds-table-row"));
	const headerRow = () => table.querySelector("cds-table-header-row");
	const cellTexts = () => bodyRows().map(row => row.querySelector("cds-table-cell").textContent.trim());

	beforeEach(async () => {
		fixture = TestBed.createComponent(TableTest);
		model = fixture.componentInstance.model;
		await settle(fixture);
		table = fixture.nativeElement.querySelector("cds-table");
	});

	it("should work", () => {
		const standalone = TestBed.createComponent(Table);
		expect(standalone.componentInstance instanceof Table).toBe(true);
		expect(table instanceof customElements.get("cds-table")).toBe(true);
	});

	it("should render a header cell per column and a row per model row", () => {
		const cells = table.querySelectorAll("cds-table-header-cell");
		expect(Array.from(cells, (cell: Element) => cell.textContent.trim())).toEqual(["Column", "Other"]);
		expect(cellTexts()).toEqual(["0", "3", "1", "2"]);
		expect(table.querySelector("cds-table-header-title").getAttribute("slot")).toBe("title");
	});

	it("should use the v1 defaults with a model", async () => {
		const defaultsFixture = TestBed.createComponent(DefaultSortTest);
		await settle(defaultsFixture);
		const table = defaultsFixture.nativeElement.querySelector("cds-table");
		expect(table.size).toBe("md");
		expect(table.useZebraStyles).toBe(true);
		expect(table.isSelectable).toBe(true);
		// the header cells sort the model; the web component itself must not move the rows
		expect(table.isSortable).toBe(false);
	});

	it("should make only sortable columns sortable", () => {
		const [sortable, unsortable] = table.querySelectorAll("cds-table-header-cell");
		expect(sortable.isSortable).toBe(true);
		expect(unsortable.isSortable).toBe(false);
	});

	it("should emit sort with the column index and leave sorting to the listener", async () => {
		spyOn(fixture.componentInstance, "onSort");
		shadow(table.querySelector("cds-table-header-cell"), "button").click();
		await settle(fixture);

		expect(fixture.componentInstance.onSort).toHaveBeenCalledWith(0);
		expect(cellTexts()).toEqual(["0", "3", "1", "2"]);
		expect(table.querySelector("cds-table-header-cell").sortDirection).toBe("none");
	});

	it("should let the web component sort and put the model in the same order without a sort listener", async () => {
		const sortFixture = TestBed.createComponent(DefaultSortTest);
		await settle(sortFixture);
		const sortTable = sortFixture.nativeElement.querySelector("cds-table");
		const header = sortTable.querySelector("cds-table-header-cell");
		const texts = () => Array.from(sortTable.querySelectorAll("cds-table-cell"), (cell: Element) => cell.textContent.trim());

		const model = sortFixture.componentInstance.model;
		model.selectRow(1, true);
		shadow(header, "button").click();
		await settle(sortFixture);
		expect(texts()).toEqual(["a", "b", "c"]);
		expect(model.data.map(row => row[0].data)).toEqual(["a", "b", "c"]);
		// row state moves with the row ("c" was selected)
		expect(model.isRowSelected(2)).toBe(true);
		expect(header.sortDirection).toBe("ascending");
		expect(model.header[0].sorted).toBe(true);
		expect(model.header[0].sortDirection).toBe("ASCENDING");

		shadow(header, "button").click();
		await settle(sortFixture);
		expect(texts()).toEqual(["c", "b", "a"]);
		expect(header.sortDirection).toBe("descending");

		// the web component keeps the current order when sorting is turned off
		shadow(header, "button").click();
		await settle(sortFixture);
		expect(texts()).toEqual(["c", "b", "a"]);
		expect(header.sortDirection).toBe("none");
		expect(model.header[0].sorted).toBe(false);

		// rows rendered later still go where the model puts them
		model.addRow([new TableItem({ data: "d" })]);
		model.addRow([new TableItem({ data: "e" })], 0);
		await settle(sortFixture);
		expect(texts()).toEqual(["e", "c", "b", "a", "d"]);
	});

	it("should emit selectRow and deselectRow and update the model", async () => {
		spyOn(fixture.componentInstance, "onSelect");
		rowCheckbox(bodyRows()[1]).click();
		await settle(fixture);

		expect(model.isRowSelected(1)).toBe(true);
		expect(bodyRows()[1].selected).toBe(true);
		expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith({ model, selectedRowIndex: 1 });

		rowCheckbox(bodyRows()[1]).click();
		await settle(fixture);

		expect(model.isRowSelected(1)).toBe(false);
		expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith({ model, deselectedRowIndex: 1 });
	});

	it("should emit selectAll and deselectAll and update the model", async () => {
		const tableComponent: Table = fixture.debugElement.children[0].componentInstance;
		spyOn(tableComponent.selectAll, "emit");
		spyOn(tableComponent.deselectAll, "emit");

		rowCheckbox(headerRow()).click();
		await settle(fixture);
		expect(model.selectedRowsCount()).toBe(4);
		expect(bodyRows().every(row => row.selected)).toBe(true);
		expect(tableComponent.selectAll.emit).toHaveBeenCalledWith(model);

		rowCheckbox(headerRow()).click();
		await settle(fixture);
		expect(model.selectedRowsCount()).toBe(0);
		expect(tableComponent.deselectAll.emit).toHaveBeenCalledWith(model);
	});

	it("should select a row when the model selects it", async () => {
		model.selectRow(2, true);
		await settle(fixture);

		expect(bodyRows()[2].selected).toBe(true);
		expect(rowCheckbox(bodyRows()[2]).checked).toBe(true);
	});

	it("should put the select all checkbox in the indeterminate state when some rows are selected", async () => {
		model.selectRow(0, true);
		await settle(fixture);
		const checkbox: any = shadow(headerRow(), "cds-checkbox");
		expect(checkbox.checked).toBe(true);
		expect(checkbox.indeterminate).toBe(true);

		model.data.forEach((_row, index) => model.selectRow(index, true));
		await settle(fixture);
		expect(checkbox.indeterminate).toBe(false);
		expect(checkbox.checked).toBe(true);
	});

	it("should not select disabled rows", async () => {
		const row = new TableRow(new TableItem({ data: "x" }), new TableItem({ data: "y" }));
		row.disabled = true;
		model.data = [row, [new TableItem({ data: "z" }), new TableItem({ data: "w" })]];
		await settle(fixture);

		expect(bodyRows()[0].disabled).toBe(true);
		model.selectAll(true);
		expect(model.isRowSelected(0)).toBe(false);
	});

	it("should not show checkboxes when isSelectable is false", async () => {
		expect(rowCheckbox(bodyRows()[0])).toBeTruthy();

		fixture.componentInstance.isSelectable = false;
		await settle(fixture);

		expect(table.isSelectable).toBe(false);
		expect(bodyRows()[0].selectionName).toBe("");
	});

	it("should select a single row with radio", async () => {
		fixture.componentInstance.radio = true;
		model.selectRow(0, true);
		await settle(fixture);

		bodyRows()[2].dispatchEvent(new CustomEvent("cds-table-row-change-selection", { bubbles: true, detail: { selected: true } }));
		await settle(fixture);

		expect(model.isRowSelected(0)).toBe(false);
		expect(model.isRowSelected(2)).toBe(true);
	});

	it("should label the row checkboxes", async () => {
		expect(bodyRows()[0].selectionLabel).toBe("Select row");
		expect(headerRow().selectionLabel).toBe("Select all rows");

		fixture.componentInstance.selectionLabelColumn = 1;
		await settle(fixture);
		expect(bodyRows()[0].selectionLabel).toBe("Select a");
	});

	it("should emit rowClick with the row index", async () => {
		bodyRows()[3].querySelector("cds-table-cell").click();
		expect(fixture.componentInstance.clicked).toBe(3);
	});

	it("should re-render the rows when the model data changes", async () => {
		model.data = [[new TableItem({ data: "0" })], [new TableItem({ data: "1" })]];
		await settle(fixture);
		expect(bodyRows().length).toBe(2);

		model.addRow([new TableItem({ data: "2" })]);
		await settle(fixture);
		expect(cellTexts()).toEqual(["0", "1", "2"]);
	});

	it("should update a cell when its model data changes", async () => {
		model.data[0][0].data = "changed";
		await settle(fixture);
		expect(cellTexts()[0]).toBe("changed");
	});

	it("should render no rows when the model empties", async () => {
		model.data = [[]];
		await settle(fixture);
		expect(bodyRows().length).toBe(0);
	});

	it("should render cell and header templates", async () => {
		model.header[0].template = fixture.componentInstance.cell;
		model.header[0].data = { name: "Templated header" };
		model.data[0][0] = new TableItem({ data: { name: "Templated cell" }, template: fixture.componentInstance.cell });
		await settle(fixture);

		expect(table.querySelector("cds-table-header-cell .custom").textContent).toBe("Templated header");
		expect(bodyRows()[0].querySelector(".custom").textContent).toBe("Templated cell");
	});

	it("should stop rendering a column hidden on the model", async () => {
		model.header[1].visible = false;
		await settle(fixture);

		expect(table.querySelectorAll("cds-table-header-cell").length).toBe(1);
		expect(bodyRows()[0].querySelectorAll("cds-table-cell").length).toBe(1);
	});

	it("should not render rows filtered by the model", async () => {
		model.header[0].filter = (item: TableItem) => item.data === "3";
		await settle(fixture);
		expect(cellTexts()).toEqual(["0", "1", "2"]);
	});

	it("should expand a row when the model expands it, and update the model when the user does", async () => {
		model.data[1][0].expandedData = "More about 3";
		model.data[1][0].expandedTemplate = fixture.componentInstance.expanded;
		await settle(fixture);
		const expandedRow = table.querySelector("cds-table-expanded-row");

		expect(table.expandable).toBe(true);
		expect(bodyRows()[1].nextElementSibling).toBe(expandedRow);
		expect(expandedRow.querySelector(".expanded").textContent).toBe("More about 3");

		model.expandRow(1, true);
		await settle(fixture);
		expect(bodyRows()[1].expanded).toBe(true);
		expect(expandedRow.expanded).toBe(true);

		shadow(bodyRows()[1], ".cds--table-expand__button").click();
		await settle(fixture);
		expect(model.isRowExpanded(1)).toBe(false);
	});

	it("should render expandAsTable data as rows", async () => {
		model.data[0][0].expandedData = [[new TableItem({ data: "child" }), new TableItem({ data: "row" })]];
		model.data[0][0].expandAsTable = true as any;
		await settle(fixture);
		expect(table.querySelectorAll("cds-table-row").length).toBe(4);

		model.expandRow(0, true);
		await settle(fixture);
		const rows = table.querySelectorAll("cds-table-row");
		expect(rows.length).toBe(5);
		expect(rows[1].textContent).toContain("child");
		expect(bodyRows()[0].expandable).toBe(true);
	});

	it("should render AI labels into the rows", async () => {
		fixture.componentInstance.withRowAILabels = true;
		model.header.unshift(new TableHeaderItem({ data: "" }));
		model.data.forEach(row => row.unshift(new TableItem({ hasAILabelDecorator: true, template: fixture.componentInstance.aiLabel })));
		await settle(fixture);

		expect(table.withRowAILabels).toBe(true);
		expect(table.querySelectorAll("cds-table-header-cell").length).toBe(2);
		const label = bodyRows()[0].querySelector(".ai-label");
		expect(label.getAttribute("slot")).toBe("ai-label");
		expect(bodyRows()[0].querySelectorAll("cds-table-cell").length).toBe(2);
	});

	it("should still accept the v1 input names", async () => {
		const aliasFixture = TestBed.createComponent(AliasTest);
		await settle(aliasFixture);
		const aliasTable = aliasFixture.nativeElement.querySelector("cds-table");
		expect(aliasTable.isSelectable).toBe(true);
		expect(aliasTable.radio).toBe(true);
		expect(aliasTable.useZebraStyles).toBe(false);
		expect(aliasTable.batchExpansion).toBe(true);
		expect(aliasTable.querySelector("cds-table-header-cell").isSortable).toBe(false);
	});
});
