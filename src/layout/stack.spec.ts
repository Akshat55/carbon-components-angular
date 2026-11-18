import { TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";

import { CdsStack } from "./stack.component";
import { settle, shadow } from "../test-helpers/web-components";

@Component({
	template: `
		<cds-stack id="default">Test</cds-stack>
		<cds-stack id="horizontal" orientation="horizontal" [gap]="gap">Test</cds-stack>
		<cds-stack id="custom" gap="2rem" useCustomGapValue>Test</cds-stack>
	`,
	imports: [CdsStack]
})
class TestStackComponent {
	gap = 5;
}

describe("Stack", () => {
	let fixture;

	beforeEach(async () => {
		fixture = TestBed.createComponent(TestStackComponent);
		await settle(fixture);
	});

	it("should keep the web component's vertical default", () => {
		const stack = fixture.nativeElement.querySelector("#default");
		expect(stack instanceof customElements.get("cds-stack")).toBe(true);
		expect(stack.orientation).toBe("vertical");
	});

	it("should set the orientation and the gap step", async () => {
		const stack = fixture.nativeElement.querySelector("#horizontal");
		expect(stack.orientation).toBe("horizontal");
		expect(shadow(stack, "div").classList.contains("cds--stack-scale-5")).toBe(true);

		fixture.componentInstance.gap = 7;
		await settle(fixture);
		expect(shadow(stack, "div").classList.contains("cds--stack-scale-7")).toBe(true);
		expect(shadow(stack, "div").classList.contains("cds--stack-scale-5")).toBe(false);
	});

	it("should use a custom gap value", () => {
		const stack = fixture.nativeElement.querySelector("#custom");
		expect(stack.style.getPropertyValue("--cds-stack-gap")).toBe("2rem");
	});
});
