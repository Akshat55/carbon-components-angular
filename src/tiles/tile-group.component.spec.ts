import {
	Component,
	ViewChild,
	ViewChildren,
	QueryList
} from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { settle, shadow } from "../test-helpers/web-components";
import { SelectionTile } from "./selection-tile.component";
import { TileGroup } from "./tile-group.component";
import { TilesModule } from "./tiles.module";

@Component({
	template: `
		<cds-tile-group [multiple]="multiple">
			<cds-selection-tile value="tile1" [selected]="true">First</cds-selection-tile>
			<cds-selection-tile value="tile2">Second</cds-selection-tile>
			<cds-selection-tile value="tile3">Third</cds-selection-tile>
		</cds-tile-group>
	`,
	imports: [TilesModule]
})
class SingleSelectHostComponent {
	multiple = false;
	@ViewChild(TileGroup, { static: true }) group!: TileGroup;
	@ViewChildren(SelectionTile) tiles!: QueryList<SelectionTile>;
}

describe("TileGroup", () => {
	describe("single select behaviour", () => {
		let fixture: ComponentFixture<SingleSelectHostComponent>;

		/** The web component tiles (radio or checkbox tiles depending on `multiple`). */
		const webTiles = (): any[] => Array.from(fixture.nativeElement.querySelectorAll("cds-radio-tile, cds-selectable-tile"));
		const isSelected = (tile: any) => !!shadow(tile, ".cds--tile--is-selected");
		const choose = async (index: number) => {
			// Radio tiles use an <input>, checkbox tiles a [role=checkbox] element.
			shadow<HTMLElement>(webTiles()[index], "input, [role=checkbox]").click();
			await settle(fixture);
		};

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [SingleSelectHostComponent]
			});
		});

		it("clears previous selection when another tile is chosen", async () => {
			fixture = TestBed.createComponent(SingleSelectHostComponent);
			await settle(fixture);

			expect(webTiles().map(isSelected)).toEqual([true, false, false]);

			await choose(1);

			expect(webTiles().map(isSelected)).toEqual([false, true, false]);
			const tiles = fixture.componentInstance.tiles.toArray();
			expect(tiles.map(tile => tile.selected)).toEqual([false, true, false]);

			await choose(2);

			expect(webTiles().map(isSelected)).toEqual([false, false, true]);
			expect(tiles.map(tile => tile.selected)).toEqual([false, false, true]);
		});

		it("keeps multiple selections when enabled", async () => {
			fixture = TestBed.createComponent(SingleSelectHostComponent);
			fixture.componentInstance.multiple = true;
			await settle(fixture);

			await choose(1);
			await choose(2);

			const tiles = fixture.componentInstance.tiles.toArray();
			expect(tiles.map(tile => tile.selected)).toEqual([true, true, true]);
			expect(webTiles().map(isSelected)).toEqual([true, true, true]);

			// deselect the middle tile should not affect the others
			await choose(1);

			expect(tiles.map(tile => tile.selected)).toEqual([true, false, true]);
			expect(webTiles().map(isSelected)).toEqual([true, false, true]);
		});
	});
});
