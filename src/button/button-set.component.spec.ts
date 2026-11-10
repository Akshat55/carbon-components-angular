import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { settle, shadow } from "../test-helpers/web-components";
import { ButtonModule } from "./button.module";
import { ButtonSet } from "./button-set.component";

@Component({
	template: `
		<cds-button-set [stacked]="stacked">
			<cds-button kind="secondary">Cancel</cds-button>
			<cds-button kind="primary">Save</cds-button>
		</cds-button-set>
	`,
	imports: [ButtonModule]
})
class ButtonSetTest {
	@ViewChild(ButtonSet) buttonSet: ButtonSet;
	stacked = false;
}

describe("ButtonSet", () => {
	let fixture: ComponentFixture<ButtonSetTest>;
	let wrapper: ButtonSetTest;
	let element: any;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [ButtonSetTest]
		});

		fixture = TestBed.createComponent(ButtonSetTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-button-set");
	});

	it("should work", () => {
		expect(wrapper.buttonSet instanceof ButtonSet).toBe(true);
		expect(element instanceof customElements.get("cds-button-set")).toBe(true);
	});

	it("should render the button set and project its buttons", () => {
		expect(shadow(element, ".cds--btn-set")).toBeTruthy();
		expect(element.querySelectorAll("cds-button").length).toBe(2);
		expect(element.textContent).toContain("Cancel");
		expect(element.textContent).toContain("Save");
	});

	it("should render the stacked layout", async () => {
		expect(shadow(element, ".cds--btn-set--stacked")).toBeFalsy();

		wrapper.stacked = true;
		await settle(fixture);

		expect(element.stacked).toBe(true);
		expect(shadow(element, ".cds--btn-set--stacked")).toBeTruthy();
	});

	it("should unwind the stacked layout when switched back", async () => {
		wrapper.stacked = true;
		await settle(fixture);
		wrapper.stacked = false;
		await settle(fixture);

		expect(shadow(element, ".cds--btn-set--stacked")).toBeFalsy();
		expect(element.querySelectorAll("cds-button").length).toBe(2);
	});
});
