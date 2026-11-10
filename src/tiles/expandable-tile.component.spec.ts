import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { settle, shadow } from "../test-helpers/web-components";
import { ExpandableTile } from "./expandable-tile.component";
import { TilesModule } from "./tiles.module";

@Component({
	template: `
		<cds-expandable-tile [(expanded)]="expanded" [interactive]="interactive">
			<span cdsAboveFold class="cds--tile-content__above-the-fold">Above the fold</span>
			<span cdsBelowFold class="cds--tile-content__below-the-fold">Below the fold</span>
		</cds-expandable-tile>
	`,
	imports: [TilesModule]
})
class ExpandableTileTest {
	@ViewChild(ExpandableTile) tile: ExpandableTile;
	expanded = false;
	interactive = false;
}

describe("ExpandableTile", () => {
	let fixture: ComponentFixture<ExpandableTileTest>;
	let wrapper: ExpandableTileTest;
	let element: any;
	const chevron = () => shadow<HTMLButtonElement>(element, "button");

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [ExpandableTileTest]
		});

		fixture = TestBed.createComponent(ExpandableTileTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-expandable-tile");
	});

	it("should work", () => {
		expect(wrapper.tile instanceof ExpandableTile).toBe(true);
		expect(element instanceof customElements.get("cds-expandable-tile")).toBe(true);
	});

	it("should project the above and below fold content", () => {
		expect(element.querySelector("[cdsAboveFold]").getAttribute("slot")).toBe("above-the-fold-content");
		expect(fixture.nativeElement.textContent).toContain("Above the fold");
		expect(fixture.nativeElement.textContent).toContain("Below the fold");
	});

	it("should render the expand button", () => {
		expect(chevron()).toBeTruthy();
		expect(chevron().classList).not.toContain("cds--tile__chevron--interactive");
	});

	it("should expand when the host sets expanded", async () => {
		expect(chevron().getAttribute("aria-expanded")).toBe("false");

		wrapper.expanded = true;
		await settle(fixture);

		expect(element.expanded).toBe(true);
		expect(chevron().getAttribute("aria-expanded")).toBe("true");
	});

	it("should expand and collapse when the tile is clicked", async () => {
		element.click();
		await settle(fixture);

		expect(wrapper.tile.expanded).toBe(true);
		expect(wrapper.expanded).toBe(true);
		expect(chevron().getAttribute("aria-expanded")).toBe("true");

		element.click();
		await settle(fixture);

		expect(wrapper.tile.expanded).toBe(false);
		expect(wrapper.expanded).toBe(false);
	});

	it("should set a max height when expanded", async () => {
		element.click();
		await settle(fixture);

		const belowFold = shadow<HTMLElement>(element, ".cds-ce--expandable-tile--below-the-fold-content");
		expect(belowFold.style.maxHeight).toContain("px");
	});

	it("should only expand from the chevron in the interactive variant", async () => {
		wrapper.interactive = true;
		await settle(fixture);
		expect(chevron().classList).toContain("cds--tile__chevron--interactive");

		element.click();
		await settle(fixture);
		expect(wrapper.expanded).toBe(false);

		chevron().click();
		await settle(fixture);
		expect(wrapper.expanded).toBe(true);
	});
});
