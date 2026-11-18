import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputModule } from "./input.module";
import { CdsTextInput } from "./text-input.component";
import { settle, shadow, typeInto } from "../test-helpers/web-components";

/** The "count/max" text the web component renders. */
const counter = (element: Element) =>
	Array.from(element.shadowRoot.querySelectorAll("label"), label => label.textContent.trim()).find(text => /^\d+\/\d+$/.test(text));

@Component({
	template: `<cds-text-input label="Name" enableCounter [maxCount]="20" [formControl]="control" />`,
	imports: [InputModule, ReactiveFormsModule]
})
class ReactiveCounterTest {
	control = new FormControl("");
}

@Component({
	template: `
		<cds-text-input
			label="Name"
			helperText="Helper"
			[invalid]="invalid"
			invalidText="Invalid"
			size="sm"
			inline
			[(ngModel)]="value"
			[decorator]="decorator" />
		<ng-template #decorator><cds-ai-label class="ai-label">AI</cds-ai-label></ng-template>
	`,
	imports: [InputModule, FormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class NgModelTest {
	value = "initial";
	invalid = false;
}

describe("Text input", () => {
	it("should work", async () => {
		const fixture = TestBed.createComponent(ReactiveCounterTest);
		await settle(fixture);
		const input = fixture.nativeElement.querySelector("cds-text-input");
		expect(input instanceof customElements.get("cds-text-input")).toBe(true);
		expect(fixture.debugElement.children[0].componentInstance instanceof CdsTextInput).toBe(true);
		expect(input.label).toBe("Name");
	});

	it("should update the character counter when the control value changes", async () => {
		const fixture = TestBed.createComponent(ReactiveCounterTest);
		await settle(fixture);
		const input = fixture.nativeElement.querySelector("cds-text-input");
		expect(counter(input)).toBe("0/20");

		fixture.componentInstance.control.setValue("carbon");
		await settle(fixture);
		expect(input.value).toBe("carbon");
		expect(counter(input)).toBe("6/20");
	});

	it("should update the control and the counter as the user types", async () => {
		const fixture = TestBed.createComponent(ReactiveCounterTest);
		await settle(fixture);
		const input = fixture.nativeElement.querySelector("cds-text-input");

		typeInto(shadow<HTMLInputElement>(input, "input"), "abcd");
		await settle(fixture);
		expect(fixture.componentInstance.control.value).toBe("abcd");
		expect(counter(input)).toBe("4/20");
	});

	it("should disable the web component with the form control", async () => {
		const fixture = TestBed.createComponent(ReactiveCounterTest);
		await settle(fixture);
		fixture.componentInstance.control.disable();
		await settle(fixture);
		expect(fixture.nativeElement.querySelector("cds-text-input").disabled).toBe(true);
	});

	it("should pass its inputs on and support ngModel", async () => {
		const fixture = TestBed.createComponent(NgModelTest);
		await settle(fixture);
		const input = fixture.nativeElement.querySelector("cds-text-input");
		expect(input.value).toBe("initial");
		expect(input.helperText).toBe("Helper");
		expect(input.size).toBe("sm");
		expect(input.inline).toBe(true);

		fixture.componentInstance.invalid = true;
		await settle(fixture);
		expect(input.invalid).toBe(true);
		expect(input.invalidText).toBe("Invalid");
	});

	it("should render the decorator in the ai-label slot", async () => {
		const fixture = TestBed.createComponent(NgModelTest);
		await settle(fixture);
		expect(fixture.nativeElement.querySelector(".ai-label").getAttribute("slot")).toBe("ai-label");
	});
});
