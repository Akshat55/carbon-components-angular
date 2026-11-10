import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { settle, shadow } from "../../test-helpers/web-components";
import { Header } from "./header.component";
import { Hamburger } from "../index";

@Component({
	template: `
		<cds-header [brand]="brand" [name]="name" skipTo="main">
			<cds-hamburger />
		</cds-header>
	`,
	imports: [Header, Hamburger]
})
class HeaderTest {
	brand = "IBM";
	name = "[Platform]";
}

describe("UI Shell Header", () => {
	let fixture: ComponentFixture<HeaderTest>;
	let wrapper: HeaderTest;
	let element: any;
	const headerName = () => element.querySelector("cds-header-name");

	beforeEach(async () => {
		fixture = TestBed.createComponent(HeaderTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-header");
	});

	it("should work", () => {
		expect(fixture.debugElement.query(By.directive(Header)).componentInstance instanceof Header).toBe(true);
		expect(element instanceof customElements.get("cds-header")).toBe(true);
	});

	it("should have a default brand of 'IBM'", () => {
		expect(shadow(headerName(), ".cds--header__name--prefix").textContent.trim()).toEqual("IBM");
	});

	it("should be able to set a custom brand", async () => {
		wrapper.brand = "Foo Brand";
		await settle(fixture);

		expect(shadow(headerName(), ".cds--header__name--prefix").textContent.trim()).toEqual("Foo Brand");
	});

	it("should be able to set a custom name", async () => {
		wrapper.name = "Foo Name";
		await settle(fixture);

		expect(headerName().textContent).toContain("Foo Name");
	});

	it("should project a hamburger component and render the skip link", () => {
		expect(element.querySelector("cds-header-menu-button")).toBeTruthy();
		expect(element.querySelector("cds-skip-to-content").href).toBe("#main");
	});
});
