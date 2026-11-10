import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { TableV2Module } from "./table-v2.module";

@Component({
	template: `
		<cds-table [isSortable]="true" [isSelectable]="true" [useZebraStyles]="true" (sorted)="onSorted($event)">
			<cds-table-header-title slot="title">Servers</cds-table-header-title>
			<cds-table-toolbar slot="toolbar">
				<cds-table-toolbar-content>
					<cds-table-toolbar-search [persistent]="true" (valueChange)="search = $event" />
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
	imports: [TableV2Module],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class TableV2Test {
	rows = [{ id: "a", name: "Alpha", selected: false }, { id: "b", name: "Beta", selected: true }];
	direction = "none";
	search = "";
	onSorted(_: Event) {}
}

describe("TableV2", () => {
	let fixture;
	let table: any;

	beforeEach(async () => {
		fixture = TestBed.createComponent(TableV2Test);
		fixture.detectChanges();
		table = fixture.nativeElement.querySelector("cds-table");
		await table.updateComplete;
	});

	it("should render the data table web components from markup", () => {
		expect(table instanceof customElements.get("cds-table")).toBe(true);
		expect(table.isSortable).toBe(true);
		expect(table.useZebraStyles).toBe(true);
		const rows = table.querySelectorAll("cds-table-row");
		expect(rows.length).toBe(2);
		expect(rows[1].selected).toBe(true);
		expect(rows[0].querySelector("cds-table-cell").textContent).toBe("Alpha");
	});

	it("should support two-way selection on rows", () => {
		const row = table.querySelector("cds-table-row");
		row.dispatchEvent(new CustomEvent("cds-table-row-change-selection", { bubbles: true, detail: { selected: true } }));
		expect(fixture.componentInstance.rows[0].selected).toBe(true);
	});

	it("should support two-way sort direction and emit sorted", () => {
		spyOn(fixture.componentInstance, "onSorted");
		const cell = table.querySelector("cds-table-header-cell");
		cell.dispatchEvent(new CustomEvent("cds-table-header-cell-sort", { bubbles: true, detail: { sortDirection: "ascending" } }));
		table.dispatchEvent(new CustomEvent("cds-table-sorted", { detail: {} }));
		expect(fixture.componentInstance.direction).toBe("ascending");
		expect(fixture.componentInstance.onSorted).toHaveBeenCalled();
	});

	it("should emit the toolbar search text", () => {
		const search = table.querySelector("cds-table-toolbar-search");
		search.dispatchEvent(new CustomEvent("cds-search-input", { bubbles: true, detail: { value: "al" } }));
		expect(fixture.componentInstance.search).toBe("al");
	});
});
