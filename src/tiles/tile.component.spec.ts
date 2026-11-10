/// <reference path="../../node_modules/@types/jasmine/index.d.ts" />

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ApplicationRef, Component, createComponent, EnvironmentInjector, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TileGroup } from "./tile-group.component";
import { TilesModule } from "./tiles.module";
import { RadioTile } from "./selection-tile.component";
import { settle } from "../test-helpers/web-components";

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
		<cds-tile-group [name]="name" [(ngModel)]="value">
			@if (multiple) {
				<cds-selectable-tile value="one">One</cds-selectable-tile>
				<cds-selectable-tile value="two">Two</cds-selectable-tile>
			} @else {
				<cds-radio-tile value="one">One</cds-radio-tile>
				<cds-radio-tile value="two">Two</cds-radio-tile>
			}
		</cds-tile-group>
	`,
	imports: [TilesModule, FormsModule]
})
class TileGroupTest {
	@ViewChild(TileGroup) group: TileGroup;
	multiple = false;
	name = "cd-tile-group";
	value: any = "one";
}

describe("TileGroup", () => {
	let fixture: ComponentFixture<TileGroupTest>;

	const render = async (multiple = false) => {
		fixture = TestBed.createComponent(TileGroupTest);
		fixture.componentInstance.multiple = multiple;
		if (multiple) {
			fixture.componentInstance.value = ["two"];
		}
		await settle(fixture);
	};

	it("should name the tiles after the group and select the tile matching ngModel", async () => {
		await render();
		const [one, two] = fixture.nativeElement.querySelectorAll("cds-radio-tile");
		expect(one.name).toBe("cd-tile-group");
		expect(one.selected).toBe(true);
		expect(two.selected).toBe(false);
	});

	it("should emit the selection, update ngModel and deselect the others when a radio tile is picked", async () => {
		await render();
		const selectedSpy = jasmine.createSpy("selected");
		fixture.componentInstance.group.selected.subscribe(selectedSpy);

		const [one, two] = fixture.nativeElement.querySelectorAll("cds-radio-tile");
		two.shadowRoot.querySelector("input").click();
		await settle(fixture);

		expect(selectedSpy).toHaveBeenCalledWith(jasmine.objectContaining({ value: "two", name: "cd-tile-group" }));
		expect(fixture.componentInstance.value).toBe("two");
		expect(one.selected).toBe(false);
		expect(two.selected).toBe(true);
	});

	it("should use an array of values for selectable tiles", async () => {
		await render(true);
		const [one, two] = fixture.nativeElement.querySelectorAll("cds-selectable-tile");
		expect([one.selected, two.selected]).toEqual([false, true]);

		one.shadowRoot.querySelector("[role=checkbox]").click();
		await settle(fixture);

		expect(fixture.componentInstance.value).toEqual(["one", "two"]);
		expect([one.selected, two.selected]).toEqual([true, true]);
	});

	it("should include a tile created dynamically", async () => {
		await render();
		const ref = createComponent(RadioTile, {
			environmentInjector: TestBed.inject(EnvironmentInjector),
			projectableNodes: [[document.createTextNode("Three")]]
		});
		ref.setInput("value", "three");
		TestBed.inject(ApplicationRef).attachView(ref.hostView);
		fixture.nativeElement.querySelector("cds-tile-group").appendChild(ref.location.nativeElement);
		await settle(fixture);

		const three = ref.location.nativeElement;
		expect(three.name).toBe("cd-tile-group");
		three.shadowRoot.querySelector("input").click();
		await settle(fixture);

		expect(fixture.componentInstance.value).toBe("three");
		expect(fixture.nativeElement.querySelector("cds-radio-tile").selected).toBe(false);
		expect(ref.instance.selected).toBe(true);
		ref.destroy();
	});
});
