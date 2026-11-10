import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { settle, shadow } from "../test-helpers/web-components";
import { SelectionTile } from "./selection-tile.component";

@Component({
	template: `<cds-selection-tile value="a">Tile</cds-selection-tile>`,
	imports: [SelectionTile]
})
class SelectionTileTest {
	@ViewChild(SelectionTile) tile: SelectionTile;
}

describe("SelectionTile", () => {
	let fixture: ComponentFixture<SelectionTileTest>;
	let component: SelectionTile;
	const webComponent = (): any => fixture.nativeElement.querySelector("cds-selectable-tile");

	beforeEach(async () => {
		fixture = TestBed.createComponent(SelectionTileTest);
		await settle(fixture);
		component = fixture.componentInstance.tile;
	});

	it("marks for check when selected is changed programmatically", async () => {
		// The tile is OnPush; a programmatic change must still reach the web component.
		component.selected = true;
		await settle(fixture);

		expect(component.selected).toBeTrue();
		expect(webComponent().selected).toBeTrue();
		expect(shadow(webComponent(), ".cds--tile--is-selected")).toBeTruthy();
	});

	it("emits change and updates selected when the user selects the tile", async () => {
		const change = jasmine.createSpy("change");
		component.change.subscribe(change);

		shadow<HTMLElement>(webComponent(), "[role=checkbox]").click();
		await settle(fixture);

		expect(change).toHaveBeenCalled();
		expect(component.selected).toBeTrue();
	});
});
