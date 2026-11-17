import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { settle } from "../test-helpers/web-components";
import { TabsModule } from "./tabs.module";

/**
 * Ported from the v6 `TabHeaderGroupVertical` specs: vertical tab headers with panels
 * rendered apart from them. In v7 that is `cds-tabs-vertical` with slotted panels.
 */
@Component({
	template: `
		<cds-tabs-vertical>
			<cds-tabs slot="tabs" [(value)]="value">
				<cds-tab value="one" target="g-one">One</cds-tab>
				<cds-tab value="two" target="g-two" secondaryLabel="Secondary">Two</cds-tab>
				<cds-tab value="three" target="g-three">Three</cds-tab>
			</cds-tabs>
			<div slot="panel" id="g-one" role="tabpanel">
				@if (value === "one") {
					<span class="content-one">One</span>
				}
			</div>
			<div slot="panel" id="g-two" role="tabpanel" hidden>Two</div>
			<div slot="panel" id="g-three" role="tabpanel" hidden>Three</div>
		</cds-tabs-vertical>
	`,
	imports: [TabsModule]
})
class VerticalGroupTest {
	value = "one";
}

describe("TabsVertical — grouped headers and panels", () => {
	let fixture, element;
	const tabs = (): any[] => Array.from(element.querySelectorAll("cds-tab"));
	const panel = (id: string): HTMLElement => element.querySelector(`#g-${id}`);

	beforeEach(async () => {
		TestBed.configureTestingModule({ imports: [VerticalGroupTest] });
		fixture = TestBed.createComponent(VerticalGroupTest);
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-tabs-vertical");
	});

	it("should work", () => {
		expect(element instanceof customElements.get("cds-tabs-vertical")).toBe(true);
	});

	it("should render the projected tabs in a tablist", () => {
		const tablist = element.querySelector("cds-tabs").shadowRoot.querySelector("[role='tablist']");
		expect(tablist).not.toBeNull();
		expect(tabs().length).toBe(3);
	});

	it("should activate the first tab and its panel on init", () => {
		expect(tabs()[0].selected).toBe(true);
		expect(panel("one").hidden).toBe(false);
		expect(element.querySelector(".content-one")).not.toBeNull();
	});

	it("should keep the other panels hidden", () => {
		expect(panel("two").hidden).toBe(true);
		expect(panel("three").hidden).toBe(true);
	});

	it("should deactivate the previously selected panel", async () => {
		tabs()[1].click();
		await settle(fixture);
		expect(fixture.componentInstance.value).toBe("two");
		expect(panel("one").hidden).toBe(true);
		expect(panel("two").hidden).toBe(false);
		expect(element.querySelector(".content-one")).toBeNull();
	});

	it("should show the secondary label in vertical tabs", () => {
		expect(tabs()[1].shadowRoot.querySelector(".cds--tabs__nav-item-secondary-label")?.textContent.trim()).toBe("Secondary");
	});
});
