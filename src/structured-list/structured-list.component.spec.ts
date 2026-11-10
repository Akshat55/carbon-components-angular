import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { settle, shadow } from "../test-helpers/web-components";
import { ListRow } from "./list-row.component";
import { StructuredList } from "./structured-list.component";
import { StructuredListModule } from "./structured-list.module";

@Component({
	template: `
		<cds-structured-list
			flushed="true"
			[condensed]="condensed"
			selection="true"
			[(ngModel)]="valueSelected"
			(selected)="onSelected()">
			<cds-structured-list-head><cds-structured-list-header-row>
				<cds-structured-list-header-cell nowrap="true">Column 1</cds-structured-list-header-cell>
				<cds-structured-list-header-cell nowrap="true">Column 2</cds-structured-list-header-cell>
				<cds-structured-list-header-cell>Column 3</cds-structured-list-header-cell>
			</cds-structured-list-header-row></cds-structured-list-head><cds-structured-list-body>
			<cds-structured-list-row value="row1">
				<cds-structured-list-cell>Row 1</cds-structured-list-cell>
				<cds-structured-list-cell nowrap="true">Row One</cds-structured-list-cell>
				<cds-structured-list-cell>Test</cds-structured-list-cell>
			</cds-structured-list-row>
			<cds-structured-list-row value="row2">
				<cds-structured-list-cell>Row 2</cds-structured-list-cell>
				<cds-structured-list-cell nowrap="true">Row Two</cds-structured-list-cell>
				<cds-structured-list-cell>Test</cds-structured-list-cell>
			</cds-structured-list-row>
		</cds-structured-list-body></cds-structured-list>
	`,
	imports: [
		StructuredListModule,
		FormsModule
	]
})
class StructuredListTest {
	valueSelected = null;
	condensed = false;
	onSelected() {}
}

describe("StructuredList", () => {
	let fixture, wrapper, element;
	const rows = (): any[] => Array.from(element.querySelectorAll("cds-structured-list-row"));

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				StructuredListTest
			]
		});
	});

	const create = async (changes: Partial<StructuredListTest> = {}) => {
		fixture = TestBed.createComponent(StructuredListTest);
		wrapper = fixture.componentInstance;
		Object.assign(wrapper, changes);
		await settle(fixture);
		element = fixture.debugElement.query(By.css("cds-structured-list")).nativeElement;
	};

	it("should work", async () => {
		await create();
		expect(fixture.debugElement.query(By.directive(StructuredList)).componentInstance instanceof StructuredList).toBe(true);
		expect(element instanceof customElements.get("cds-structured-list")).toBe(true);
	});

	it("should set cds--structured-list--flushed class", async () => {
		await create();
		expect(shadow(element, ".cds--structured-list--flush")).toBeTruthy();
	});

	it("should change valueSelected to row1 on click and emit selected event", async () => {
		await create();
		spyOn(wrapper, "onSelected");
		rows()[0].click();
		await settle(fixture);
		expect(wrapper.valueSelected).toEqual("row1");
		expect(wrapper.onSelected).toHaveBeenCalled();
	});

	it("should set cds--structured-list--condensed class", async () => {
		await create({ condensed: true });
		expect(shadow(element, ".cds--structured-list--condensed")).toBeTruthy();
	});

	it("should deselect the previously selected row", async () => {
		await create();
		const listRows = fixture.debugElement.queryAll(By.directive(ListRow));

		rows()[0].click();
		await settle(fixture);
		expect(listRows[0].componentInstance.selected).toBe(true);
		expect(rows()[0].selected).toBe(true);

		rows()[1].click();
		await settle(fixture);

		expect(listRows[0].componentInstance.selected).toBe(false);
		expect(rows()[0].selected).toBe(false);
		expect(listRows[1].componentInstance.selected).toBe(true);
		expect(rows()[1].selected).toBe(true);
	});

	it("should select the row matching a value written by the form", async () => {
		await create();
		fixture.debugElement.query(By.directive(StructuredList)).componentInstance.writeValue("row2");
		await settle(fixture);

		const listRows = fixture.debugElement.queryAll(By.directive(ListRow));
		expect(listRows[1].componentInstance.selected).toBe(true);
		expect(rows()[1].selected).toBe(true);
	});

	it("should render header cells in the head and body cells in the rows", async () => {
		await create();
		expect(element.querySelectorAll("cds-structured-list-head cds-structured-list-header-cell").length).toBe(3);
		expect(rows()[0].querySelectorAll("cds-structured-list-cell").length).toBe(3);
	});
});

@Component({
	template: `
		<cds-structured-list [selection]="true" [formControl]="control"><cds-structured-list-body>
			<cds-structured-list-row value="a"><cds-structured-list-cell>A</cds-structured-list-cell></cds-structured-list-row>
			<cds-structured-list-row value="b"><cds-structured-list-cell>B</cds-structured-list-cell></cds-structured-list-row>
		</cds-structured-list-body></cds-structured-list>
	`,
	imports: [StructuredListModule, ReactiveFormsModule]
})
class ReactiveStructuredListTest {
	control = new FormControl("b");
}

describe("StructuredList with reactive forms", () => {
	it("should write and update the form value", async () => {
		const fixture = TestBed.createComponent(ReactiveStructuredListTest);
		await settle(fixture);
		const rows: any[] = Array.from(fixture.nativeElement.querySelectorAll("cds-structured-list-row"));
		expect(rows.map(row => row.selected)).toEqual([false, true]);

		rows[0].click();
		await settle(fixture);
		expect(fixture.componentInstance.control.value).toBe("a");
		expect(rows.map(row => row.selected)).toEqual([true, false]);
	});
});
