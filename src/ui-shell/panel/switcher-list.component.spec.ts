import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { settle, shadow } from "../../test-helpers/web-components";
import { UIShellModule } from "../ui-shell.module";
import { SwitcherList } from "./switcher-list.component";
import { SwitcherListItem } from "./switcher-list-item.component";

@Component({
	template: `
		<cds-switcher-list>
			<cds-switcher-list-item [active]="firstActive" href="#one">Product one</cds-switcher-list-item>
			<cds-switcher-list-item [active]="secondActive" href="#two">Product two</cds-switcher-list-item>
		</cds-switcher-list>
	`,
	imports: [UIShellModule]
})
class SwitcherListTest {
	@ViewChild(SwitcherList) list: SwitcherList;
	firstActive = false;
	secondActive = false;
}

describe("SwitcherList", () => {
	let fixture: ComponentFixture<SwitcherListTest>;
	let wrapper: SwitcherListTest;
	const links = (): HTMLAnchorElement[] => Array.from(fixture.nativeElement.querySelectorAll("cds-switcher-item"))
		.map((item: Element) => shadow<HTMLAnchorElement>(item, "a.cds--switcher__item-link"));

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [
				SwitcherListTest,
				RouterModule.forRoot([], { initialNavigation: "disabled", useHash: true })
			]
		});

		fixture = TestBed.createComponent(SwitcherListTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
	});

	it("should work", () => {
		expect(wrapper.list instanceof SwitcherList).toBe(true);
		expect(fixture.debugElement.queryAll(By.directive(SwitcherListItem)).length).toBe(2);
		expect(fixture.nativeElement.querySelector("cds-switcher") instanceof customElements.get("cds-switcher")).toBe(true);
	});

	it("should project its items and render their links", () => {
		expect(links().length).toBe(2);
		expect(fixture.nativeElement.querySelector("cds-switcher-item").textContent).toContain("Product one");
		expect(links()[0].getAttribute("href")).toBe("#one");
	});

	it("should move the selected class between items", async () => {
		expect(links()[0].classList).not.toContain("cds--switcher__item-link--selected");

		wrapper.firstActive = true;
		await settle(fixture);
		expect(links()[0].classList).toContain("cds--switcher__item-link--selected");

		wrapper.firstActive = false;
		wrapper.secondActive = true;
		await settle(fixture);

		expect(links()[0].classList).not.toContain("cds--switcher__item-link--selected");
		expect(links()[1].classList).toContain("cds--switcher__item-link--selected");
	});

	it("should select the item when active is set on the instance", async () => {
		const items = fixture.debugElement.queryAll(By.directive(SwitcherListItem));

		items[1].componentInstance.active = true;
		items[1].injector.get(SwitcherListItem)["changeDetectorRef"].markForCheck();
		await settle(fixture);

		expect(links()[1].classList).toContain("cds--switcher__item-link--selected");
	});
});
