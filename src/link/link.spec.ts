import { TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";

import { CdsLink, LinkIconDirective } from "./index";
import { settle, shadow } from "../test-helpers/web-components";

@Component({
	template: `
		<cds-link href="https://angular.carbondesignsystem.com/" [disabled]="disabled" [inline]="inline" size="lg">
			link
			<svg cdsLinkIcon></svg>
		</cds-link>
	`,
	imports: [CdsLink, LinkIconDirective]
})
class TestLinkComponent {
	disabled = false;
	inline = false;
}

describe("Link", () => {
	let fixture;
	let link: any;

	beforeEach(async () => {
		fixture = TestBed.createComponent(TestLinkComponent);
		await settle(fixture);
		link = fixture.nativeElement.querySelector("cds-link");
	});

	it("should create a Link", () => {
		expect(link instanceof customElements.get("cds-link")).toBe(true);
		expect(link.href).toBe("https://angular.carbondesignsystem.com/");
		expect(link.size).toBe("lg");
		expect(shadow<HTMLAnchorElement>(link, "a").getAttribute("href")).toBe("https://angular.carbondesignsystem.com/");
	});

	it("should create a disabled link", async () => {
		fixture.componentInstance.disabled = true;
		await settle(fixture);
		expect(link.disabled).toBe(true);
		expect(shadow(link, "a")).toBeNull();
	});

	it("should create an inline link", async () => {
		fixture.componentInstance.inline = true;
		await settle(fixture);
		expect(link.inline).toBe(true);
	});

	it("should put cdsLinkIcon in the icon slot", () => {
		expect(link.querySelector("svg").getAttribute("slot")).toBe("icon");
	});
});
