/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Component, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TileGroup } from "./tile-group.component";
import { TilesModule } from "./tiles.module";

import { Tile } from "./tile.component";

describe("Tile", () => {
	let component: Tile;
	let fixture: ComponentFixture<Tile>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [Tile]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(Tile);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create a Tile", () => {
		expect(component).toBeTruthy();
	});
});

@Component({
	template: `
		<cds-tile-group [multiple]="multiple" [name]="name" [(ngModel)]="value">
			<cds-selection-tile value="one">One</cds-selection-tile>
			<cds-selection-tile value="two">Two</cds-selection-tile>
		</cds-tile-group>
	`,
	imports: [TilesModule, FormsModule]
})
class TileGroupTest {
	@ViewChild(TileGroup) group: TileGroup;
	multiple = false;
	name = "cd-tile-group";
	value = "one";
}

describe("TileGroup", () => {
	let fixture: ComponentFixture<TileGroupTest>;

	const render = async (multiple = false) => {
		fixture = TestBed.createComponent(TileGroupTest);
		fixture.componentInstance.multiple = multiple;
		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
	};

	it("should render checkbox tiles when multiple is set", async () => {
		await render(true);
		expect(fixture.nativeElement.querySelectorAll("cds-selectable-tile").length).toBe(2);
		expect(fixture.nativeElement.querySelector("cds-radio-tile")).toBeNull();
	});

	it("should render radio tiles by default, named after the group", async () => {
		await render();
		const tiles = fixture.nativeElement.querySelectorAll("cds-radio-tile");
		expect(tiles.length).toBe(2);
		Array.from<any>(tiles).forEach(tile => expect(tile.name).toBe("cd-tile-group"));
	});

	it("should select the tile matching ngModel", async () => {
		await render();
		const [one, two] = fixture.nativeElement.querySelectorAll("cds-radio-tile");
		expect(one.selected).toBe(true);
		expect(two.selected).toBe(false);
	});

	it("should emit the selection, update ngModel and deselect the others when a tile is picked", async () => {
		await render();
		const selectedSpy = jasmine.createSpy("selected");
		fixture.componentInstance.group.selected.subscribe(selectedSpy);

		const [one, two] = fixture.nativeElement.querySelectorAll("cds-radio-tile");
		await two.updateComplete;
		two.shadowRoot.querySelector("input").click();
		fixture.detectChanges();

		expect(selectedSpy).toHaveBeenCalledWith(jasmine.objectContaining({ value: "two", name: "cd-tile-group" }));
		expect(fixture.componentInstance.value).toBe("two");
		expect(one.selected).toBe(false);
		expect(two.selected).toBe(true);
	});
});
