import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { settle } from "../test-helpers/web-components";
import { TabsModule } from "./tabs.module";
import { TabsVertical } from "./tabs-vertical.component";
import { TabSkeleton } from "./tab-skeleton.component";

@Component({
	template: `
		<cds-tabs-vertical height="300px">
			<cds-tabs slot="tabs">
				<cds-tab target="v-one">One</cds-tab>
				<cds-tab target="v-two">Two</cds-tab>
				<cds-tab target="v-three">Three</cds-tab>
			</cds-tabs>
			<div slot="panel" id="v-one" role="tabpanel">One</div>
			<div slot="panel" id="v-two" role="tabpanel" hidden>Two</div>
			<div slot="panel" id="v-three" role="tabpanel" hidden>Three</div>
		</cds-tabs-vertical>
	`,
	imports: [TabsModule]
})
class TabsVerticalTest {}

describe("TabsVertical", () => {
	let fixture, element;
	const tabs = (): any[] => Array.from(element.querySelectorAll("cds-tab"));
	const panels = (): HTMLElement[] => Array.from(element.querySelectorAll("[role='tabpanel']"));

	beforeEach(async () => {
		TestBed.configureTestingModule({ imports: [TabsVerticalTest] });
		fixture = TestBed.createComponent(TabsVerticalTest);
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-tabs-vertical");
	});

	it("should work", () => {
		expect(fixture.debugElement.query(By.directive(TabsVertical)).componentInstance instanceof TabsVertical).toBe(true);
		expect(element instanceof customElements.get("cds-tabs-vertical")).toBe(true);
	});

	it("should render vertical tabs", () => {
		expect(element.querySelector("cds-tabs").vertical).toBe(true);
		tabs().forEach(tab => expect(tab.vertical).toBe(true));
	});

	it("should pass `height` on as the web component's custom height", () => {
		expect(element.customHeight).toBe("300px");
	});

	it("should activate the first tab on init", () => {
		expect(tabs()[0].selected).toBe(true);
	});

	it("should keep the other panels hidden", () => {
		expect(panels().map(panel => panel.hidden)).toEqual([false, true, true]);
	});

	it("should move the active state between tabs when a tab is clicked", async () => {
		tabs()[1].click();
		await settle(fixture);
		expect(tabs()[1].selected).toBe(true);
		expect(tabs()[0].selected).toBe(false);
		expect(panels().map(panel => panel.hidden)).toEqual([true, false, true]);
	});
});

@Component({
	template: `
		@if (skeleton) {
			<cds-tabs-skeleton [numOfTabs]="4" [contained]="true" />
		} @else {
			<cds-tabs>
				<cds-tab>One</cds-tab>
			</cds-tabs>
		}
	`,
	imports: [TabsModule]
})
class TabSkeletonTest {
	skeleton = true;
}

describe("TabSkeleton", () => {
	let fixture;

	beforeEach(async () => {
		TestBed.configureTestingModule({ imports: [TabSkeletonTest] });
		fixture = TestBed.createComponent(TabSkeletonTest);
		await settle(fixture);
	});

	it("should work", () => {
		const skeleton = fixture.debugElement.query(By.directive(TabSkeleton));
		expect(skeleton.componentInstance instanceof TabSkeleton).toBe(true);
		expect(skeleton.nativeElement instanceof customElements.get("cds-tabs-skeleton")).toBe(true);
	});

	it("should render `numOfTabs` tab skeletons", () => {
		const tabs = fixture.nativeElement.querySelectorAll("cds-tab-skeleton");
		expect(tabs.length).toBe(4);
		expect(tabs[0] instanceof customElements.get("cds-tab-skeleton")).toBe(true);
	});

	it("should pass `contained` on", () => {
		expect(fixture.nativeElement.querySelector("cds-tabs-skeleton").contained).toBe(true);
	});

	it("should swap between the skeleton and the real tabs", async () => {
		fixture.componentInstance.skeleton = false;
		await settle(fixture);
		expect(fixture.nativeElement.querySelector("cds-tabs-skeleton")).toBeNull();
		expect(fixture.nativeElement.querySelector("cds-tab")).not.toBeNull();
	});
});
