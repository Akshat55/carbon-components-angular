import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { TableModule } from "./table.module";
import { TableModel } from "./table-model.class";
import { TableItem } from "./table-item.class";
import { TableHeaderItem } from "./table-header-item.class";
import { settle, shadow } from "../test-helpers/web-components";

@Component({
	template: `
		<cds-table isSortable isSelectable (sorted)="onSorted($event)">
			<cds-table-header-title slot="title">Servers</cds-table-header-title>
			<cds-table-header-description slot="description">All of them</cds-table-header-description>
			<cds-table-toolbar slot="toolbar">
				<cds-table-batch-actions (cancel)="cancelled = true">
					<button>Delete</button>
				</cds-table-batch-actions>
				<cds-table-toolbar-content>
					<cds-table-toolbar-search persistent [(ngModel)]="search" />
				</cds-table-toolbar-content>
			</cds-table-toolbar>
			<cds-table-head>
				<cds-table-header-row>
					<cds-table-header-cell [(sortDirection)]="direction">Name</cds-table-header-cell>
				</cds-table-header-row>
			</cds-table-head>
			<cds-table-body>
				@for (row of rows; track row.id) {
					<cds-table-row [selectionName]="row.id" [(selected)]="row.selected">
						<cds-table-cell>{{ row.name }}</cds-table-cell>
					</cds-table-row>
				}
			</cds-table-body>
		</cds-table>
	`,
	imports: [TableModule, FormsModule]
})
class MarkupTest {
	rows = [{ id: "a", name: "Beta", selected: false }, { id: "b", name: "Alpha", selected: true }];
	direction = "none";
	search = "";
	cancelled = false;
	onSorted(_: Event) {}
}

@Component({
	template: `
		<cds-table [model]="model">
			<cds-table-toolbar slot="toolbar">
				<cds-table-batch-actions [model]="model">
					<button>Delete</button>
				</cds-table-batch-actions>
			</cds-table-toolbar>
		</cds-table>
		<cds-table-skeleton [rowCount]="3" [showToolbar]="false" />
	`,
	imports: [TableModule]
})
class BatchActionsTest {
	model = new TableModel();

	constructor() {
		this.model.header = [new TableHeaderItem({ data: "Name" })];
		this.model.data = [[new TableItem({ data: "a" })], [new TableItem({ data: "b" })], [new TableItem({ data: "c" })]];
	}
}

describe("Table as markup", () => {
	let fixture: ComponentFixture<MarkupTest>;
	let table: any;

	beforeEach(async () => {
		fixture = TestBed.createComponent(MarkupTest);
		await settle(fixture);
		table = fixture.nativeElement.querySelector("cds-table");
	});

	it("should render the data table web components from markup", () => {
		expect(table.isSortable).toBe(true);
		expect(table.isSelectable).toBe(true);
		// unset inputs keep the web component's defaults
		expect(table.size).toBe("lg");
		expect(table.useZebraStyles).toBe(false);
		const rows = table.querySelectorAll("cds-table-row");
		expect(rows.length).toBe(2);
		expect(rows[1].selected).toBe(true);
		expect(rows[0].querySelector("cds-table-cell").textContent).toBe("Beta");
	});

	it("should let the web component sort the rows, with two-way sortDirection", async () => {
		spyOn(fixture.componentInstance, "onSorted");
		shadow(table.querySelector("cds-table-header-cell"), "button").click();
		await settle(fixture);

		expect(fixture.componentInstance.direction).toBe("ascending");
		expect(fixture.componentInstance.onSorted).toHaveBeenCalled();
		expect(Array.from(table.querySelectorAll("cds-table-cell"), (cell: Element) => cell.textContent)).toEqual(["Alpha", "Beta"]);
	});

	it("should support two-way selection on rows", async () => {
		const row = table.querySelector("cds-table-row");
		shadow(shadow(row, "cds-checkbox"), "input").click();
		await settle(fixture);

		expect(fixture.componentInstance.rows[0].selected).toBe(true);
	});

	it("should update selected rows when the user selects all", async () => {
		const header = table.querySelector("cds-table-header-row");
		shadow(shadow(header, "cds-checkbox"), "input").click();
		await settle(fixture);

		expect(fixture.componentInstance.rows.every(row => row.selected)).toBe(true);
		expect(table.querySelector("cds-table-batch-actions").active).toBeTruthy();
	});

	it("should emit cancel from the batch actions", async () => {
		const actions = table.querySelector("cds-table-batch-actions");
		actions.dispatchEvent(new CustomEvent("cds-table-batch-actions-cancel-clicked", { bubbles: true }));
		expect(fixture.componentInstance.cancelled).toBe(true);
	});

	it("should support ngModel on the toolbar search and filter the rows", async () => {
		const search = table.querySelector("cds-table-toolbar-search");
		search.dispatchEvent(new CustomEvent("cds-search-input", { bubbles: true, detail: { value: "alp" } }));
		await settle(fixture);

		expect(fixture.componentInstance.search).toBe("alp");
		const rows = table.querySelectorAll("cds-table-row");
		expect(rows[0].filtered).toBe(true);
		expect(rows[1].filtered).toBe(false);

		fixture.componentInstance.search = "beta";
		await settle(fixture);
		expect(search.value).toBe("beta");
	});

	it("should put the title, description and toolbar in their slots", () => {
		expect(table.querySelector("cds-table-header-description").getAttribute("slot")).toBe("description");
		expect(table.querySelector("cds-table-toolbar").getAttribute("slot")).toBe("toolbar");
	});
});

describe("Table batch actions with a model", () => {
	let fixture: ComponentFixture<BatchActionsTest>;
	let actions: any;
	let model: TableModel;

	beforeEach(async () => {
		fixture = TestBed.createComponent(BatchActionsTest);
		model = fixture.componentInstance.model;
		await settle(fixture);
		actions = fixture.nativeElement.querySelector("cds-table-batch-actions");
	});

	it("should reveal the batch action bar when the model gains a selection", async () => {
		expect(actions.active).toBe(false);

		model.selectRow(0, true);
		model.selectRow(2, true);
		await settle(fixture);

		expect(actions.active).toBe(true);
		expect(actions.selectedRowsCount).toBe(2);
		expect(actions.totalRowsCount).toBe(3);
	});

	it("should deselect the model's rows on cancel", async () => {
		model.selectAll(true);
		await settle(fixture);

		shadow<HTMLElement>(actions, ".cds--batch-summary__cancel").click();
		await settle(fixture);

		expect(model.selectedRowsCount()).toBe(0);
		expect(actions.active).toBe(false);
	});

	it("should render the skeleton", () => {
		const skeleton = fixture.nativeElement.querySelector("cds-table-skeleton");
		expect(skeleton.rowCount).toBe(3);
		expect(skeleton.showToolbar).toBe(false);
		expect(skeleton.columnCount).toBe(5);
	});
});
