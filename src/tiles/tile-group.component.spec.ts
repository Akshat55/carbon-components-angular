import {
	Component,
	ViewChild,
	ViewChildren,
	QueryList
} from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { settle, shadow } from "../test-helpers/web-components";
import { BaseSelectionTile, RadioTile, SelectableTile } from "./selection-tile.component";
import { TileGroup } from "./tile-group.component";
import { TilesModule } from "./tiles.module";

@Component({
	template: `
		<cds-tile-group>
			@if (multiple) {
				<cds-selectable-tile value="tile1" [selected]="true">First</cds-selectable-tile>
				<cds-selectable-tile value="tile2">Second</cds-selectable-tile>
				<cds-selectable-tile value="tile3">Third</cds-selectable-tile>
			} @else {
				<cds-radio-tile value="tile1" [selected]="true">First</cds-radio-tile>
				<cds-radio-tile value="tile2">Second</cds-radio-tile>
				<cds-radio-tile value="tile3">Third</cds-radio-tile>
			}
		</cds-tile-group>
	`,
	imports: [TilesModule]
})
class TileGroupHostComponent {
	multiple = false;
	@ViewChild(TileGroup, { static: true }) group!: TileGroup;
	@ViewChildren(RadioTile) radioTiles!: QueryList<RadioTile>;
	@ViewChildren(SelectableTile) selectableTiles!: QueryList<SelectableTile>;

	get tiles(): BaseSelectionTile[] {
		return [...this.radioTiles.toArray(), ...this.selectableTiles.toArray()];
	}
}

describe("TileGroup", () => {
	let fixture: ComponentFixture<TileGroupHostComponent>;

	const webTiles = (): any[] => Array.from(fixture.nativeElement.querySelectorAll("cds-radio-tile, cds-selectable-tile"));
	const isSelected = (tile: any) => !!shadow(tile, ".cds--tile--is-selected");
	const choose = async (index: number) => {
		// Radio tiles use an <input>, selectable tiles a [role=checkbox] element.
		shadow<HTMLElement>(webTiles()[index], "input, [role=checkbox]").click();
		await settle(fixture);
	};

	it("clears the previous radio tile when another is chosen", async () => {
		fixture = TestBed.createComponent(TileGroupHostComponent);
		await settle(fixture);

		expect(webTiles().map(isSelected)).toEqual([true, false, false]);

		await choose(1);

		expect(webTiles().map(isSelected)).toEqual([false, true, false]);
		const tiles = fixture.componentInstance.tiles;
		expect(tiles.map(tile => tile.selected)).toEqual([false, true, false]);

		await choose(2);

		expect(webTiles().map(isSelected)).toEqual([false, false, true]);
		expect(tiles.map(tile => tile.selected)).toEqual([false, false, true]);
	});

	it("keeps multiple selections with selectable tiles", async () => {
		fixture = TestBed.createComponent(TileGroupHostComponent);
		fixture.componentInstance.multiple = true;
		await settle(fixture);

		await choose(1);
		await choose(2);

		const tiles = fixture.componentInstance.tiles;
		expect(tiles.map(tile => tile.selected)).toEqual([true, true, true]);
		expect(webTiles().map(isSelected)).toEqual([true, true, true]);

		// deselecting the middle tile should not affect the others
		await choose(1);

		expect(tiles.map(tile => tile.selected)).toEqual([true, false, true]);
		expect(webTiles().map(isSelected)).toEqual([true, false, true]);
	});
});
