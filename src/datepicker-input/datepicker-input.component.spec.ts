import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Component } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { settle, shadow, typeInto } from "../test-helpers/web-components";
import { DatePickerInput } from "./datepicker-input.component";

@Component({
	template: `
		<cds-date-picker-input
			theme="dark"
			label="label"
			placeholder="mm/dd/yyyy"
			[disabled]="disabled"
			[invalid]="invalid"
			invalidText="invalid text"
			(valueChange)="valueChange($event)"
			[(ngModel)]="model" />
		`,
	imports: [DatePickerInput, FormsModule]
})
class DatePickerInputTest {
	model = null;
	value = null;
	disabled = false;
	invalid = false;
	valueChange(event) {
		this.value = event;
	}
}

describe("DatePickerInput", () => {
	let fixture, wrapper, element;
	const input = () => shadow<HTMLInputElement>(element, "input");

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				DatePickerInputTest
			]
		});
	});

	const create = async (changes: Partial<DatePickerInputTest> = {}) => {
		fixture = TestBed.createComponent(DatePickerInputTest);
		wrapper = fixture.componentInstance;
		Object.assign(wrapper, changes);
		await settle(fixture);
		element = fixture.debugElement.query(By.css("cds-date-picker-input")).nativeElement;
	};

	it("should work", async () => {
		await create();
		expect(fixture.debugElement.query(By.directive(DatePickerInput)).componentInstance instanceof DatePickerInput).toBe(true);
		expect(element instanceof customElements.get("cds-date-picker-input")).toBe(true);
	});

	it("should propagate changes back to the form and emit a valueChange event with the correct value", async () => {
		await create();
		spyOn(wrapper, "valueChange").and.callThrough();
		typeInto(input(), "03/02/2001");
		await settle(fixture);
		expect(fixture.componentInstance.model).toBe("03/02/2001");
		expect(wrapper.valueChange).toHaveBeenCalled();
		expect(wrapper.value).toBe("03/02/2001");
	});

	it("should write the ngModel value to the input", async () => {
		await create({ model: "12/24/2020" });
		expect(input().value).toBe("12/24/2020");
	});

	it("should set label to 'label'", async () => {
		await create();
		expect(shadow(element, ".cds--label").textContent.trim()).toBe("label");
	});

	it("should set placeholder to mm/dd/yyyy", async () => {
		await create();
		expect(element.getAttribute("placeholder")).toBe("mm/dd/yyyy");
		expect(input().placeholder).toBe("mm/dd/yyyy");
	});

	it("should disable input when disabled is true", async () => {
		await create({ disabled: true });
		expect(input().disabled).toBe(true);
	});

	it("should display invalid text when invalid is true", async () => {
		await create({ invalid: true });
		expect(shadow(element, ".cds--form-requirement")).toBeTruthy();
		expect(shadow(element, ".cds--form-requirement").textContent.trim()).toBe("invalid text");
	});

	it("should set theme to dark", async () => {
		await create();
		expect(element.getAttribute("theme")).toBe("dark");
	});
});

@Component({
	template: `<cds-date-picker-input label="Date" [formControl]="control" />`,
	imports: [DatePickerInput, ReactiveFormsModule]
})
class ReactiveDatePickerInputTest {
	control = new FormControl("01/01/2024");
}

describe("DatePickerInput with reactive forms", () => {
	it("should write, update and disable with the form control", async () => {
		const fixture = TestBed.createComponent(ReactiveDatePickerInputTest);
		await settle(fixture);
		const element = fixture.nativeElement.querySelector("cds-date-picker-input");
		expect(shadow<HTMLInputElement>(element, "input").value).toBe("01/01/2024");

		typeInto(shadow<HTMLInputElement>(element, "input"), "02/02/2024");
		await settle(fixture);
		expect(fixture.componentInstance.control.value).toBe("02/02/2024");

		fixture.componentInstance.control.disable();
		await settle(fixture);
		expect(shadow<HTMLInputElement>(element, "input").disabled).toBe(true);
	});
});
