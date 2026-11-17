import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { settle, shadow } from "../test-helpers/web-components";
import { TabsModule } from "./tabs.module";
import { Tab } from "./tab.component";
import { Tabs } from "./tabs.component";

/**
 * Behaviour of the tab features, ported from the v6 "regular tab approach" specs.
 * In v7 the headers are `cds-tab`s and the panels are any element they `target`.
 */
describe("Tabs — tab features", () => {
	async function create<T>(type: new (...args: any[]) => T) {
		const fixture = TestBed.createComponent(type);
		await settle(fixture);
		return fixture;
	}
	const tabElements = (root: HTMLElement): any[] => Array.from(root.querySelectorAll("cds-tab"));
	const link = (tab: Element) => shadow(tab, "[role='tab']");

	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [TabsModule] });
	});

	it("should use the tab marked `active` as the initial selection", async () => {
		const fixture = await create(InitialSelectionSecondTest);
		const tabs = tabElements(fixture.nativeElement);
		expect(link(tabs[0]).getAttribute("aria-selected")).toBe("false");
		expect(link(tabs[1]).getAttribute("aria-selected")).toBe("true");
	});

	it("should allow a custom class on the tab panel", async () => {
		const fixture = await create(CustomClassOnPanelTest);
		const panel = fixture.nativeElement.querySelector("#custom-panel");
		expect(panel.classList.contains("my-panel")).toBe(true);
		expect(panel.hidden).toBe(false);
	});

	it("should not render tabs excluded with @if", async () => {
		const fixture = await create(ConditionalTabTest);
		expect(tabElements(fixture.nativeElement).length).toBe(1);

		fixture.componentInstance.showSecond = true;
		await settle(fixture);
		expect(tabElements(fixture.nativeElement).length).toBe(2);
		expect(fixture.debugElement.queryAll(By.directive(Tab)).length).toBe(2);
	});

	it("should show `secondaryLabel` when parent tabs use `type=contained`", async () => {
		const fixture = await create(SecondaryLabelContainedTest);
		const label = shadow(tabElements(fixture.nativeElement)[0], ".cds--tabs__nav-item-secondary-label");
		expect(label?.textContent.trim()).toBe("(21/25)");
		expect(fixture.nativeElement.querySelector("cds-tabs").getAttribute("type")).toBe("contained");
	});

	it("should pass `type` on to the tabs", async () => {
		const fixture = await create(SecondaryLabelContainedTest);
		expect(tabElements(fixture.nativeElement)[0].type).toBe("contained");
	});

	it("should render projected icons in icon-only tabs and use `ariaLabel` as their label", async () => {
		const fixture = await create(IconTabBadgeTest);
		const tab = tabElements(fixture.nativeElement)[0];
		expect(tab.querySelector("svg.test-icon")).not.toBeNull();
		expect(link(tab).getAttribute("aria-label")).toBe("Dashboard");
	});

	it("should render a badge on an icon tab when `badgeIndicator` is true", async () => {
		const fixture = await create(IconTabBadgeTest);
		const [first, second] = tabElements(fixture.nativeElement);
		expect(shadow(first, "cds-badge-indicator")).toBeNull();
		expect(shadow(second, "cds-badge-indicator")).not.toBeNull();
	});

	it("should emit the tab index when a dismissable close button is clicked", async () => {
		const fixture = await create(DismissableTabsTest);
		const tabs = tabElements(fixture.nativeElement);
		shadow<HTMLElement>(tabs[1], "cds-button").click();
		await settle(fixture);
		expect(fixture.componentInstance.closedIndex).toBe(1);
		expect(fixture.componentInstance.closedTab).toBe(true);
	});

	it("should move selection with ArrowLeft / ArrowRight / Home / End (automatic activation)", async () => {
		const fixture = await create(KeyboardNavigationTest);
		const tabs = tabElements(fixture.nativeElement);
		const press = async (index: number, key: string) => {
			tabs[index].dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, composed: true }));
			await settle(fixture);
		};

		await press(0, "ArrowRight");
		expect(fixture.componentInstance.value).toBe("b");
		await press(1, "End");
		expect(fixture.componentInstance.value).toBe("c");
		await press(2, "Home");
		expect(fixture.componentInstance.value).toBe("a");
		await press(0, "ArrowLeft");
		expect(fixture.componentInstance.value).toBe("c");
	});

	it("with selectionMode manual, should activate the focused tab on Space", async () => {
		const fixture = await create(ManualActivationTest);
		const tabs = tabElements(fixture.nativeElement);
		const press = async (index: number, key: string) => {
			tabs[index].dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, composed: true }));
			await settle(fixture);
		};

		await press(0, "ArrowRight");
		expect(fixture.componentInstance.value).toBe("a");
		expect(tabs[1].highlighted).toBe(true);

		await press(1, " ");
		expect(fixture.componentInstance.value).toBe("b");
	});

	it("should map the deprecated `followFocus` to `selectionMode`", async () => {
		const fixture = await create(ManualActivationTest);
		expect(fixture.nativeElement.querySelector("cds-tabs").selectionMode).toBe("manual");
	});

	it("should only show the active panel", async () => {
		const fixture = await create(KeyboardNavigationTest);
		const panels: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll("[role='tabpanel']"));
		expect(panels.map(p => p.hidden)).toEqual([false, true, true]);

		tabElements(fixture.nativeElement)[2].click();
		await settle(fixture);
		expect(panels.map(p => p.hidden)).toEqual([true, true, false]);
	});

	it("should emit `selected` when a non-disabled tab is activated", async () => {
		const fixture = await create(SelectedOutputTest);
		const tabs = tabElements(fixture.nativeElement);

		tabs[1].click();
		await settle(fixture);
		expect(fixture.componentInstance.selected).toEqual(["second"]);

		tabs[2].click();
		await settle(fixture);
		expect(fixture.componentInstance.selected).toEqual(["second"]);
		expect(tabs[2].selected).toBe(false);
	});

	it("should pass `fullWidth` to contained `cds-tabs`", async () => {
		const fixture = await create(FullWidthContainedTest);
		const tabs = fixture.nativeElement.querySelector("cds-tabs");
		expect(tabs.fullWidth).toBe(true);
		expect(tabs.hasAttribute("full-width")).toBe(true);
	});

	it("should render the panel body only for the selected tab with @if", async () => {
		const fixture = await create(LazyPanelTest);
		expect(fixture.nativeElement.querySelector(".lazy-two")).toBeNull();

		tabElements(fixture.nativeElement)[1].click();
		await settle(fixture);
		expect(fixture.nativeElement.querySelector(".lazy-two")).not.toBeNull();
	});
});

@Component({
	template: `
		<cds-tabs>
			<cds-tab target="p1">One</cds-tab>
			<cds-tab target="p2" [active]="true">Two</cds-tab>
		</cds-tabs>
		<div id="p1" role="tabpanel">1</div>
		<div id="p2" role="tabpanel">2</div>
	`,
	imports: [TabsModule]
})
class InitialSelectionSecondTest {}

@Component({
	template: `
		<cds-tabs>
			<cds-tab target="custom-panel">One</cds-tab>
		</cds-tabs>
		<div id="custom-panel" class="my-panel" role="tabpanel">1</div>
	`,
	imports: [TabsModule]
})
class CustomClassOnPanelTest {}

@Component({
	template: `
		<cds-tabs>
			<cds-tab>One</cds-tab>
			@if (showSecond) {
				<cds-tab>Two</cds-tab>
			}
		</cds-tabs>
	`,
	imports: [TabsModule]
})
class ConditionalTabTest {
	showSecond = false;
}

@Component({
	template: `
		<cds-tabs type="contained">
			<cds-tab secondaryLabel="(21/25)">One</cds-tab>
			<cds-tab>Two</cds-tab>
		</cds-tabs>
	`,
	imports: [TabsModule]
})
class SecondaryLabelContainedTest {}

@Component({
	template: `
		<cds-tabs>
			<cds-tab [iconOnly]="true" ariaLabel="Dashboard"><svg class="test-icon"></svg></cds-tab>
			<cds-tab [iconOnly]="true" ariaLabel="Settings" [badgeIndicator]="true"><svg></svg></cds-tab>
		</cds-tabs>
	`,
	imports: [TabsModule]
})
class IconTabBadgeTest {}

@Component({
	template: `
		<cds-tabs [dismissable]="true" (tabClose)="closedIndex = $event">
			<cds-tab>One</cds-tab>
			<cds-tab (tabClose)="closedTab = true">Two</cds-tab>
			<cds-tab>Three</cds-tab>
		</cds-tabs>
	`,
	imports: [TabsModule]
})
class DismissableTabsTest {
	closedIndex: number;
	closedTab = false;
}

@Component({
	template: `
		<cds-tabs [(value)]="value">
			<cds-tab value="a" target="panel-a">A</cds-tab>
			<cds-tab value="b" target="panel-b">B</cds-tab>
			<cds-tab value="c" target="panel-c">C</cds-tab>
		</cds-tabs>
		<div id="panel-a" role="tabpanel">A</div>
		<div id="panel-b" role="tabpanel" hidden>B</div>
		<div id="panel-c" role="tabpanel" hidden>C</div>
	`,
	imports: [TabsModule]
})
class KeyboardNavigationTest {
	value = "a";
}

@Component({
	template: `
		<cds-tabs [followFocus]="false" [(value)]="value">
			<cds-tab value="a">A</cds-tab>
			<cds-tab value="b">B</cds-tab>
		</cds-tabs>
	`,
	imports: [TabsModule]
})
class ManualActivationTest {
	value = "a";
}

@Component({
	template: `
		<cds-tabs>
			<cds-tab>First</cds-tab>
			<cds-tab (selected)="selected.push('second')">Second</cds-tab>
			<cds-tab [disabled]="true" (selected)="selected.push('third')">Third</cds-tab>
		</cds-tabs>
	`,
	imports: [TabsModule]
})
class SelectedOutputTest {
	selected: string[] = [];
}

@Component({
	template: `
		<cds-tabs type="contained" [fullWidth]="true">
			<cds-tab>One</cds-tab>
			<cds-tab>Two</cds-tab>
		</cds-tabs>
	`,
	imports: [TabsModule]
})
class FullWidthContainedTest {}

@Component({
	template: `
		<cds-tabs [(value)]="value">
			<cds-tab value="one">One</cds-tab>
			<cds-tab value="two">Two</cds-tab>
		</cds-tabs>
		<div role="tabpanel">
			@if (value === "two") {
				<span class="lazy-two">Two</span>
			}
		</div>
	`,
	imports: [TabsModule, Tab]
})
class LazyPanelTest {
	value = "one";
}
