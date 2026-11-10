import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Component, Input } from "@angular/core";

import { settle, shadow } from "../test-helpers/web-components";
import { ProgressBar } from "./";

@Component({
	template: `
		<cds-progress-bar
			[label]="label"
			[helperText]="helperText"
			[max]="max"
			[size]="size"
			[status]="status"
			[type]="type"
			[value]="value" />
		`,
	imports: [ProgressBar]
})
class TestProgessBarComponent {
	@Input() label = "Label";
	@Input() helperText = "helper text";
	@Input() max = 100;
	@Input() size: "small" | "big" = "big";
	@Input() status: "active" | "finished" | "error" = "active";
	@Input() type: "default" | "inline" | "indented" = "default";
	@Input() value: undefined | number = 100;
}

describe("Progress bar", () => {
	let fixture: ComponentFixture<TestProgessBarComponent>;
	let component: TestProgessBarComponent;
	let element: any;
	const wrapperHas = (className: string) => !!shadow(element, `.cds--progress-bar.${className}`);

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [TestProgessBarComponent]
		});
		fixture = TestBed.createComponent(TestProgessBarComponent);
		component = fixture.componentInstance;
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-progress-bar");
	});

	it("should create a progress bar component", () => {
		expect(element instanceof customElements.get("cds-progress-bar")).toBe(true);
		expect(shadow(element, ".cds--progress-bar")).toBeTruthy();
		expect(shadow(element, ".cds--progress-bar__label").textContent).toContain("Label");
		expect(shadow(element, ".cds--progress-bar__helper-text").textContent).toContain("helper text");
	});

	it("should create an indeterminate progress bar when value is undefined & status is active", async () => {
		component.value = undefined;
		component.status = "active";
		await settle(fixture);
		expect(wrapperHas("cds--progress-bar--indeterminate")).toBe(true);
	});

	it("should set the appropriate status class", async () => {
		component.status = "finished";
		await settle(fixture);
		expect(wrapperHas("cds--progress-bar--finished")).toBe(true);
		component.status = "error";
		await settle(fixture);
		expect(wrapperHas("cds--progress-bar--error")).toBe(true);
	});

	it("should set the the correct size class", async () => {
		expect(wrapperHas("cds--progress-bar--big")).toBe(true);
		component.size = "small";
		await settle(fixture);
		expect(wrapperHas("cds--progress-bar--small")).toBe(true);
	});
});
