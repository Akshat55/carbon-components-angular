import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { settle, shadow } from "../test-helpers/web-components";
import { InlineLoading, InlineLoadingState } from "./inline-loading.component";

@Component({
	template: `
		<cds-inline-loading
			[state]="state"
			loadingText="loading"
			[successText]="successText"
			[errorText]="errorText"
			[successDelay]="successDelay">
		</cds-inline-loading>
	`,
	imports: [InlineLoading]
})
class InlineLoadingTest {
	@ViewChild(InlineLoading) loader: InlineLoading;
	state: InlineLoadingState | string = InlineLoadingState.Active;
	successText = "";
	errorText = "";
	successDelay = 400;
}

describe("Inline Loading", () => {
	let fixture: ComponentFixture<InlineLoadingTest>;
	let wrapper: InlineLoadingTest;
	let element: any;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [InlineLoadingTest]
		});

		fixture = TestBed.createComponent(InlineLoadingTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-inline-loading");
	});

	it("should work", () => {
		expect(wrapper.loader instanceof InlineLoading).toBe(true);
		expect(element instanceof customElements.get("cds-inline-loading")).toBe(true);
		expect(element.status).toBe("active");
		expect(element.textContent).toContain("loading");
	});

	it("should show `finished` state and handle `state` as enum", async () => {
		wrapper.successText = "success text";
		wrapper.state = InlineLoadingState.Finished;
		await settle(fixture);
		expect(element.status).toBe("finished");
		expect(element.textContent).toContain("success text");
	});

	it("should show `error` state and handle `state` as a string", async () => {
		wrapper.errorText = "error text";
		wrapper.state = "error";
		await settle(fixture);
		expect(element.status).toBe("error");
		expect(shadow(element, ".cds--inline-loading--error")).toBeTruthy();
		expect(element.textContent).toContain("error text");
	});

	it("should swap the spinner for the checkmark when loading finishes", async () => {
		wrapper.successText = "all done";
		await settle(fixture);
		expect(shadow(element, ".cds--loading")).toBeTruthy();

		wrapper.state = InlineLoadingState.Finished;
		await settle(fixture);

		expect(shadow(element, ".cds--loading")).toBeFalsy();
		expect(shadow(element, ".cds--inline-loading__checkmark-container")).toBeTruthy();
		expect(element.textContent.trim()).toBe("all done");
	});

	it("should hide the loader when the state becomes hidden", async () => {
		wrapper.state = InlineLoadingState.Hidden;
		await settle(fixture);

		expect(element.hidden).toBe(true);
		expect(shadow(element, ".cds--inline-loading__animation")).toBeFalsy();
	});

	it("should show the finished state before the success event fires", async () => {
		const onSuccess = jasmine.createSpy("onSuccess");
		wrapper.loader.onSuccess.subscribe(onSuccess);

		wrapper.state = InlineLoadingState.Finished;
		wrapper.loader.success = true;
		// render without waiting for the zone, which would wait out the success timer
		fixture.detectChanges();
		await element.updateComplete;

		expect(shadow(element, ".cds--inline-loading__checkmark-container")).toBeTruthy();
		expect(onSuccess).not.toHaveBeenCalled();

		await new Promise(resolve => setTimeout(resolve, wrapper.successDelay + 20));

		expect(onSuccess).toHaveBeenCalled();
	});
});
