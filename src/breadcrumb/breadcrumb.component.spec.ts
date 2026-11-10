import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { settle } from "../test-helpers/web-components";
import { Breadcrumb } from "./breadcrumb.component";
import { BreadcrumbItemComponent } from "./breadcrumb-item.component";

@Component({
	template: `
	<cds-breadcrumb [noTrailingSlash]="noTrailingSlash">
		<cds-breadcrumb-item href="#">Breadcrumb 1</cds-breadcrumb-item>
		<cds-breadcrumb-item href="#">Breadcrumb 2</cds-breadcrumb-item>
		<cds-breadcrumb-item href="#">Breadcrumb 3</cds-breadcrumb-item>
		<cds-breadcrumb-item href="#">Breadcrumb 4</cds-breadcrumb-item>
		<cds-breadcrumb-item href="#">Breadcrumb 5</cds-breadcrumb-item>
	</cds-breadcrumb>`,
	imports: [Breadcrumb, BreadcrumbItemComponent]
})
class TestBreadcrumb {
	noTrailingSlash = true;
}

@Component({
	template: `
		<cds-breadcrumb
			[noTrailingSlash]="noTrailingSlash"
			[threshold]="threshold"
			[items]="items" />
	`,
	imports: [Breadcrumb]
})
class TestBreadcrumbModel {
	noTrailingSlash = true;
	threshold = 4;
	items = [];
}

describe("Breadcrumb", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestBreadcrumb, TestBreadcrumbModel]
		});
	});

	it("should work", async () => {
		const fixture = TestBed.createComponent(TestBreadcrumb);
		await settle(fixture);
		const element = fixture.nativeElement.querySelector("cds-breadcrumb");
		expect(fixture.debugElement.query(By.directive(Breadcrumb)).componentInstance instanceof Breadcrumb).toBe(true);
		expect(element instanceof customElements.get("cds-breadcrumb")).toBe(true);
		expect(element.noTrailingSlash).toBe(true);
	});

	it("should create a breadcrumb with five items and no overflow menu", async () => {
		const fixture = TestBed.createComponent(TestBreadcrumb);
		await settle(fixture);

		const items = fixture.debugElement.queryAll(By.directive(BreadcrumbItemComponent));
		expect(items.length).toBe(5);
		expect(fixture.nativeElement.querySelectorAll("cds-breadcrumb-link").length).toBe(5);
		expect(fixture.nativeElement.querySelector("cds-breadcrumb-overflow-menu")).toBeNull();
	});

	it("should create a breadcrumb with an overflow menu in second position", async () => {
		const fixture = TestBed.createComponent(TestBreadcrumbModel);
		fixture.componentInstance.items = [
			{ content: "Breadcrumb 1", href: "#1" },
			{ content: "Breadcrumb 2", href: "#2" },
			{ content: "Breadcrumb 3", href: "#3" },
			{ content: "Breadcrumb 4", href: "#4" },
			{ content: "Breadcrumb 5", href: "#5" }
		];
		await settle(fixture);

		const items: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll("cds-breadcrumb > cds-breadcrumb-item"));
		// 4 because one holds the overflow menu
		expect(items.length).toBe(4);
		expect(items[1].children[0].tagName.toLowerCase()).toEqual("cds-breadcrumb-overflow-menu");
		expect(items[1].querySelectorAll("cds-overflow-menu-item").length).toBe(2);
		expect(items[0].textContent.trim()).toBe("Breadcrumb 1");
		expect(items[3].textContent.trim()).toBe("Breadcrumb 5");
	});
});
