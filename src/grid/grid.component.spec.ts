import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { CdsColumn, CdsGrid } from "./grid.component";
import { settle, shadow } from "../test-helpers/web-components";

@Component({
	template: `
		<cds-grid id="grid" [condensed]="condensed" [fullWidth]="true" align="start">
			<cds-column id="spans" [sm]="1" [md]="2" lg="25%" xlg="auto" [max]="4">Column</cds-column>
			<cds-column id="span" [span]="2">
				<cds-grid id="subgrid" narrow>
					<cds-column>Nested</cds-column>
				</cds-grid>
			</cds-column>
			<cds-column id="plain">No inputs</cds-column>
		</cds-grid>
	`,
	imports: [CdsGrid, CdsColumn]
})
class TestGridComponent {
	condensed = false;
}

describe("Grid", () => {
	let fixture;
	const element = (id: string) => fixture.nativeElement.querySelector(`#${id}`);

	beforeEach(async () => {
		fixture = TestBed.createComponent(TestGridComponent);
		await settle(fixture);
	});

	it("should render a css grid", () => {
		const grid = element("grid");
		expect(grid instanceof customElements.get("cds-grid")).toBe(true);
		expect(grid.fullWidth).toBe(true);
		expect(grid.align).toBe("start");
		expect(shadow(grid, "[grid]")).toBeTruthy();
	});

	it("should update the grid mode", async () => {
		fixture.componentInstance.condensed = true;
		await settle(fixture);
		expect(element("grid").condensed).toBe(true);
		expect(element("grid").hasAttribute("condensed")).toBe(true);
	});

	it("should render a nested grid as a subgrid", async () => {
		await settle(fixture);
		const subgrid = shadow(element("subgrid"), "[subgrid]");
		expect(subgrid).toBeTruthy();
		expect(subgrid.getAttribute("mode")).toBe("narrow");
	});

	it("should render columns with spans per breakpoint", () => {
		const column = element("spans");
		expect(column instanceof customElements.get("cds-column")).toBe(true);
		expect(column.sm).toBe(1);
		expect(column.md).toBe(2);
		expect(column.lg).toBe("25%");
		expect(column.xlg).toBe("auto");
		expect(column.max).toBe(4);
		expect(element("span").span).toBe(2);
	});

	it("should render a column without inputs", () => {
		const column = element("plain");
		expect(column.textContent).toBe("No inputs");
		expect(column.span).toBeUndefined();
	});
});
