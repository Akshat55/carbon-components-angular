import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { settle, shadow } from "../test-helpers/web-components";
import { RadioTile, SelectableTile } from "./selection-tile.component";

@Component({
	template: `
		<cds-selectable-tile value="a" [(selected)]="selected">Tile</cds-selectable-tile>
		<cds-radio-tile value="b">Radio</cds-radio-tile>
	`,
	imports: [SelectableTile, RadioTile]
})
class SelectionTileTest {
	@ViewChild(SelectableTile) tile: SelectableTile;
	@ViewChild(RadioTile) radio: RadioTile;
	selected = false;
}

describe("SelectableTile and RadioTile", () => {
	let fixture: ComponentFixture<SelectionTileTest>;
	const webComponent = (): any => fixture.nativeElement.querySelector("cds-selectable-tile");

	beforeEach(async () => {
		fixture = TestBed.createComponent(SelectionTileTest);
		await settle(fixture);
	});

	it("should sit on the web components", () => {
		expect(fixture.componentInstance.tile instanceof SelectableTile).toBe(true);
		expect(webComponent() instanceof customElements.get("cds-selectable-tile")).toBe(true);
		expect(fixture.componentInstance.radio instanceof RadioTile).toBe(true);
		expect(fixture.nativeElement.querySelector("cds-radio-tile") instanceof customElements.get("cds-radio-tile")).toBe(true);
	});

	it("should select the tile from the host", async () => {
		fixture.componentInstance.selected = true;
		await settle(fixture);

		expect(webComponent().selected).toBeTrue();
		expect(shadow(webComponent(), ".cds--tile--is-selected")).toBeTruthy();
	});

	it("should update [(selected)] when the user selects the tile", async () => {
		shadow<HTMLElement>(webComponent(), "[role=checkbox]").click();
		await settle(fixture);

		expect(fixture.componentInstance.tile.selected).toBeTrue();
		expect(fixture.componentInstance.selected).toBeTrue();
	});
});
