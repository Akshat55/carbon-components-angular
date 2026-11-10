import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { settle, shadow } from "../test-helpers/web-components";
import { SkeletonModule } from "./skeleton.module";
import { SkeletonText } from "./skeleton-text.component";
import { SkeletonPlaceholder } from "./skeleton-placeholder.component";
import { SkeletonIcon } from "./skeleton-icon.component";

@Component({
	template: `
		<cds-skeleton-text
			[lines]="lines"
			[heading]="heading"
			[maxLineWidth]="maxLineWidth">
		</cds-skeleton-text>
		<cds-skeleton-placeholder></cds-skeleton-placeholder>
		<cds-skeleton-icon></cds-skeleton-icon>
	`,
	imports: [SkeletonModule]
})
class SkeletonTest {
	@ViewChild(SkeletonText) text: SkeletonText;
	@ViewChild(SkeletonPlaceholder) placeholder: SkeletonPlaceholder;
	@ViewChild(SkeletonIcon) icon: SkeletonIcon;

	lines = 1;
	heading = false;
	maxLineWidth = 120;
}

describe("Skeleton components", () => {
	let fixture: ComponentFixture<SkeletonTest>;
	let wrapper: SkeletonTest;
	const text = () => fixture.nativeElement.querySelector("cds-skeleton-text");
	const lines = (): HTMLElement[] => Array.from(text().shadowRoot.querySelectorAll(".cds--skeleton__text"));

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [SkeletonTest]
		});

		fixture = TestBed.createComponent(SkeletonTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
	});

	it("should work", () => {
		expect(wrapper.text instanceof SkeletonText).toBe(true);
		expect(wrapper.placeholder instanceof SkeletonPlaceholder).toBe(true);
		expect(wrapper.icon instanceof SkeletonIcon).toBe(true);
	});

	it("should render the placeholder and icon web components", () => {
		const placeholder = fixture.nativeElement.querySelector("cds-skeleton-placeholder");
		const icon = fixture.nativeElement.querySelector("cds-skeleton-icon");
		expect(placeholder instanceof customElements.get("cds-skeleton-placeholder")).toBe(true);
		expect(shadow(placeholder, ".cds--skeleton__placeholder")).toBeTruthy();
		expect(icon instanceof customElements.get("cds-skeleton-icon")).toBe(true);
	});

	it("should render one line per configured line", async () => {
		expect(lines().length).toBe(1);

		wrapper.lines = 4;
		await settle(fixture);

		expect(text().paragraph).toBe(true);
		expect(lines().length).toBe(4);
	});

	it("should render the heading variant", async () => {
		expect(shadow(text(), ".cds--skeleton__heading")).toBeFalsy();

		wrapper.heading = true;
		await settle(fixture);

		expect(shadow(text(), ".cds--skeleton__heading")).toBeTruthy();
	});

	it("should render line widths within the configured bounds", async () => {
		wrapper.lines = 3;
		wrapper.maxLineWidth = 45;
		await settle(fixture);

		lines().forEach(line => {
			expect(parseInt(line.style.width, 10)).toBeLessThanOrEqual(45);
		});
	});
});
