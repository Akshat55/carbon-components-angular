import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Component } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { settle, shadow } from "../test-helpers/web-components";
import { DatePicker } from "./datepicker.component";

@Component({
	template: `
	<cds-date-picker
		label="Date picker label"
		placeholder="mm/dd/yyyy"
		theme="light"
		[(ngModel)]="value"
		[disabled]="disabled"
		[invalid]="invalid"
		invalidText="invalid text"
		dateFormat="m/d/Y"
		(valueChange)="onValueChange()" />
	`,
	imports: [DatePicker, FormsModule]
})
class DatePickerTest {
	value: any = new Date(new Date().getFullYear(), 5, 15);
	disabled = false;
	invalid = false;
	onValueChange() {}
}

const isoDate = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

describe("DatePicker", () => {
	let fixture, element, wrapper;
	const input = () => shadow<HTMLInputElement>(fixture.nativeElement.querySelector("cds-date-picker-input"), "input");

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				DatePickerTest
			]
		});
	});

	it("should work", async () => {
		fixture = TestBed.createComponent(DatePickerTest);
		await settle(fixture);
		element = fixture.debugElement.query(By.css("cds-date-picker"));
		expect(element.componentInstance instanceof DatePicker).toBe(true);
		expect(element.nativeElement instanceof customElements.get("cds-date-picker")).toBe(true);
	});

	it("should set label to Date picker label", async () => {
		fixture = TestBed.createComponent(DatePickerTest);
		await settle(fixture);
		const dateInput = fixture.nativeElement.querySelector("cds-date-picker-input");
		expect(shadow(dateInput, ".cds--label").textContent.trim()).toEqual("Date picker label");
	});

	it("should set the value of the component to be the value specified in the wrapper", async () => {
		fixture = TestBed.createComponent(DatePickerTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);

		element = fixture.debugElement.query(By.css("cds-date-picker"));
		expect(element.componentInstance.value).toEqual([wrapper.value]);
		expect(element.nativeElement.value).toBe(isoDate(wrapper.value));

		wrapper.value = new Date(new Date().getFullYear(), 14, 50);
		await settle(fixture);

		expect(element.componentInstance.value).toEqual([wrapper.value]);
		expect(element.nativeElement.value).toBe(isoDate(wrapper.value));
	});

	it("should set placeholder to mm/dd/yyyy", async () => {
		fixture = TestBed.createComponent(DatePickerTest);
		await settle(fixture);
		expect(input().placeholder).toEqual("mm/dd/yyyy");
	});

	it("should disable input", async () => {
		fixture = TestBed.createComponent(DatePickerTest);
		await settle(fixture);
		fixture.componentInstance.disabled = true;
		await settle(fixture);
		expect(input().disabled).toBeTruthy();
	});

	it("should set date format to m/d/Y", async () => {
		fixture = TestBed.createComponent(DatePickerTest);
		await settle(fixture);
		element = fixture.debugElement.query(By.css("cds-date-picker"));
		expect(element.componentInstance.dateFormat).toEqual("m/d/Y");
		expect(element.nativeElement.dateFormat).toEqual("m/d/Y");
	});

	it("should accept theme (deprecated: the web component follows the surrounding layer)", async () => {
		fixture = TestBed.createComponent(DatePickerTest);
		await settle(fixture);
		element = fixture.debugElement.query(By.css("cds-date-picker"));
		expect(element.componentInstance.theme).toEqual("light");
	});

	it("should set invalid to true and set the invalidText to 'invalid text'", async () => {
		fixture = TestBed.createComponent(DatePickerTest);
		element = fixture.debugElement.query(By.css("cds-date-picker"));
		fixture.componentInstance.invalid = true;
		await settle(fixture);
		expect(element.componentInstance.invalid).toBe(true);
		expect(element.nativeElement.getAttribute("invalidText")).toEqual("invalid text");
		const dateInput = element.nativeElement.querySelector("cds-date-picker-input");
		expect(shadow(dateInput, ".cds--form-requirement").textContent.trim()).toEqual("invalid text");
	});

	it("should update ngModel and call onValueChange when dates are picked", async () => {
		fixture = TestBed.createComponent(DatePickerTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		spyOn(wrapper, "onValueChange");
		const picked = [new Date(2024, 1, 2)];
		fixture.nativeElement.querySelector("cds-date-picker")
			.dispatchEvent(new CustomEvent("cds-date-picker-changed", { bubbles: true, detail: { selectedDates: picked } }));
		await settle(fixture);
		expect(wrapper.onValueChange).toHaveBeenCalled();
		expect(wrapper.value).toEqual(picked);
	});
});

@Component({
	template: `
		<cds-date-picker
			label="Start"
			rangeLabel="End"
			[range]="true"
			[formControl]="control" />
	`,
	imports: [DatePicker, ReactiveFormsModule]
})
class RangeDatePickerTest {
	control = new FormControl<Date[]>([new Date(2024, 0, 1), new Date(2024, 0, 10)]);
}

describe("DatePicker range with reactive forms", () => {
	let fixture;
	let picker;

	beforeEach(async () => {
		fixture = TestBed.createComponent(RangeDatePickerTest);
		await settle(fixture);
		picker = fixture.nativeElement.querySelector("cds-date-picker");
	});

	it("should render from / to inputs", () => {
		const inputs = picker.querySelectorAll("cds-date-picker-input");
		expect(Array.from<any>(inputs).map(input => input.kind)).toEqual(["from", "to"]);
		expect(shadow(inputs[1], ".cds--label").textContent.trim()).toBe("End");
	});

	it("should write the range to the web component", () => {
		expect(picker.value).toBe("2024-01-01/2024-01-10");
	});

	it("should update the form value when a range is picked", async () => {
		const picked = [new Date(2024, 2, 1), new Date(2024, 2, 5)];
		picker.dispatchEvent(new CustomEvent("cds-date-picker-changed", { bubbles: true, detail: { selectedDates: picked } }));
		await settle(fixture);
		expect(fixture.componentInstance.control.value).toEqual(picked);
	});

	it("should disable the inputs with the form control", async () => {
		fixture.componentInstance.control.disable();
		await settle(fixture);
		Array.from<any>(picker.querySelectorAll("cds-date-picker-input"))
			.forEach(input => expect(shadow<HTMLInputElement>(input, "input").disabled).toBe(true));
	});
});
