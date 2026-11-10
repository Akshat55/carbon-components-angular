import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { settle, shadow } from "../test-helpers/web-components";
import { Loading } from "./loading.component";

@Component({
	template: `
		<cds-loading
			[isActive]="isActive"
			[size]="size"
			[overlay]="overlay"
			title="title" />`,
	imports: [Loading]
})
class LoadingTest {
	isActive = true;
	size: "sm" | "normal" = "sm";
	overlay = false;
}

describe("Loading", () => {
	let fixture, wrapper, element;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [LoadingTest]
		});
	});

	const create = async (changes: Partial<LoadingTest> = {}) => {
		fixture = TestBed.createComponent(LoadingTest);
		wrapper = fixture.componentInstance;
		Object.assign(wrapper, changes);
		await settle(fixture);
		element = fixture.debugElement.query(By.css("cds-loading"));
	};

	it("should work", async () => {
		await create();
		expect(element.componentInstance instanceof Loading).toBe(true);
		expect(element.nativeElement instanceof customElements.get("cds-loading")).toBe(true);
	});

	it("should stop the animation when isActive is false", async () => {
		await create({ overlay: true });
		expect(element.nativeElement.active).toBe(true);
		expect(shadow(element.nativeElement, ".cds--loading--stop")).toBeFalsy();

		wrapper.isActive = false;
		await settle(fixture);

		expect(element.componentInstance.isActive).toBe(false);
		expect(element.nativeElement.active).toBe(false);
		expect(shadow(element.nativeElement, ".cds--loading--stop")).toBeTruthy();
	});

	it("should set title to 'title'", async () => {
		await create();
		expect(shadow(element.nativeElement, "title").textContent.trim()).toBe("title");
	});

	it("should render the small variant when size is sm", async () => {
		await create();
		expect(element.nativeElement.small).toBe(true);
		expect(shadow(element.nativeElement, ".cds--loading__background").hasAttribute("hidden")).toBe(false);

		wrapper.size = "normal";
		await settle(fixture);
		expect(element.nativeElement.small).toBe(false);
		expect(shadow(element.nativeElement, ".cds--loading__background").hasAttribute("hidden")).toBe(true);
	});

	it("should render the stopped overlay when overlay is true and isActive is false", async () => {
		await create({ overlay: true, isActive: false });
		expect(element.nativeElement.overlay).toBe(true);
		expect(shadow(element.nativeElement, ".cds--loading.cds--loading--stop")).toBeTruthy();
	});
});
