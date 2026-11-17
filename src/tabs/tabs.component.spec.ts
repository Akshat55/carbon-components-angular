import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ApplicationRef, Component, createComponent, EnvironmentInjector } from "@angular/core";

import { settle, shadow } from "../test-helpers/web-components";
import { Tab, Tabs } from "./index";

@Component({
	template: `
		<cds-tabs [(value)]="value" (selected)="onSelected($event)">
			<cds-tab id="one" value="one" target="panel-one">One</cds-tab>
			<cds-tab id="two" value="two" target="panel-two">Two</cds-tab>
			<cds-tab id="three" value="three" target="panel-three">Three</cds-tab>
		</cds-tabs>
		<div id="panel-one" role="tabpanel">Panel 1</div>
		<div id="panel-two" role="tabpanel" hidden>Panel 2</div>
		<div id="panel-three" role="tabpanel" hidden>Panel 3</div>
	`,
	imports: [Tabs, Tab]
})
class TabsTest {
	value: string;
	selectedTab: any = null;
	onSelected(tab: HTMLElement) {
		this.selectedTab = tab;
	}
}

describe("Tabs", () => {
	let fixture, wrapper: TabsTest, element, tabs: Tabs;
	const tab = (id: string): any => element.querySelector(`#${id}`);
	const tabWrappers = (): Tab[] => fixture.debugElement.queryAll(By.directive(Tab)).map(debug => debug.componentInstance);
	const panel = (id: string): HTMLElement => fixture.nativeElement.querySelector(`#panel-${id}`);
	const press = async (id: string, key: string) => {
		tab(id).dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, composed: true }));
		await settle(fixture);
	};
	const choose = async (id: string) => {
		tab(id).click();
		await settle(fixture);
	};

	beforeEach(async () => {
		TestBed.configureTestingModule({ imports: [TabsTest] });
		fixture = TestBed.createComponent(TabsTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-tabs");
		tabs = fixture.debugElement.query(By.directive(Tabs)).componentInstance;
	});

	it("should work", () => {
		expect(tabs instanceof Tabs).toBe(true);
		expect(element instanceof customElements.get("cds-tabs")).toBe(true);
		expect(tab("one") instanceof customElements.get("cds-tab")).toBe(true);
	});

	it("should have 3 tabs", () => {
		expect(tabWrappers().length).toBe(3);
	});

	it("should emit the selected event on click and change the selected tab on keydown", async () => {
		await choose("two");
		expect(wrapper.selectedTab?.value).toBe("two");
		expect(wrapper.value).toBe("two");

		await press("two", "ArrowRight");
		expect(wrapper.value).toBe("three");
		expect(tab("three").selected).toBe(true);
	});

	it("should move to the next tab on ArrowRight and the previous one on ArrowLeft", async () => {
		await press("one", "ArrowRight");
		expect(wrapper.value).toBe("two");
		await press("two", "ArrowLeft");
		expect(wrapper.value).toBe("one");
	});

	it("should wrap to the first tab on ArrowRight from the last tab", async () => {
		await choose("three");
		await press("three", "ArrowRight");
		expect(wrapper.value).toBe("one");
	});

	it("should wrap to the last tab on ArrowLeft from the first tab", async () => {
		await press("one", "ArrowLeft");
		expect(wrapper.value).toBe("three");
	});

	it("should select the tab whose value is bound", async () => {
		wrapper.value = "three";
		await settle(fixture);
		expect(tab("three").selected).toBe(true);
		expect(tab("one").selected).toBe(false);
		expect(panel("three").hidden).toBe(false);
		expect(panel("one").hidden).toBe(true);
	});

	it("should give only the selected tab a tab stop", async () => {
		await choose("two");
		const link = (id: string) => shadow(tab(id), "[role='tab']");
		expect(link("two").getAttribute("tabindex")).toBe("0");
		expect(link("one").getAttribute("tabindex")).toBe("-1");
		expect(link("three").getAttribute("tabindex")).toBe("-1");
	});

	it("should activate the first tab on init", () => {
		expect(tab("one").selected).toBe(true);
		expect(shadow(tab("one"), "[role='tab']").getAttribute("aria-selected")).toBe("true");
	});

	it("should keep the inactive panels hidden", () => {
		expect(panel("one").hidden).toBe(false);
		expect(panel("two").hidden).toBe(true);
		expect(panel("three").hidden).toBe(true);
	});

	it("should move the active state between tabs when a tab is clicked", async () => {
		await choose("three");
		expect(tab("three").selected).toBe(true);
		expect(tab("one").selected).toBe(false);
		expect(tabWrappers()[2].active).toBe(true);
		expect(tabWrappers()[0].active).toBe(false);
		expect(panel("three").hidden).toBe(false);
		expect(panel("one").hidden).toBe(true);
	});

	it("should select tabs created with createComponent", async () => {
		const appRef = TestBed.inject(ApplicationRef);
		const ref = createComponent(Tab, {
			environmentInjector: TestBed.inject(EnvironmentInjector),
			projectableNodes: [[document.createTextNode("Four")]]
		});
		ref.setInput("id", "four");
		ref.setInput("value", "four");
		appRef.attachView(ref.hostView);
		element.append(ref.location.nativeElement);
		await settle(fixture);

		expect(element.querySelectorAll("cds-tab").length).toBe(4);
		await choose("four");
		expect(wrapper.selectedTab).toBe(ref.location.nativeElement);
		expect(ref.instance.active).toBe(true);
		expect(wrapper.value).toBe("four");
		ref.destroy();
	});
});
