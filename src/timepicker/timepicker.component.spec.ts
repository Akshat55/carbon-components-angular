import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Component } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

import { settle, shadow, typeInto } from "../test-helpers/web-components";
import { TimePicker } from "./timepicker.component";
import { TimePickerSelect } from "../timepicker-select/timepicker-select.component";

@Component({
	template: `
		<cds-time-picker
			theme="dark"
			(valueChange)="onChange()"
			[(value)]="value"
			label="test"
			size="lg"
			disabled="false" />
	`,
	imports: [TimePicker]
})
class TimePickerTest {
	value = "12:12";
	onChange() {}
}

describe("TimePicker", () => {
	let fixture, wrapper, element;
	const input = () => shadow<HTMLInputElement>(fixture.nativeElement.querySelector("cds-time-picker"), ".cds--time-picker__input-field");

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				TimePickerTest
			]
		});
	});

	it("should work", async () => {
		fixture = TestBed.createComponent(TimePickerTest);
		await settle(fixture);
		expect(fixture.debugElement.query(By.directive(TimePicker)).componentInstance instanceof TimePicker).toBe(true);
		expect(fixture.nativeElement.querySelector("cds-time-picker") instanceof customElements.get("cds-time-picker")).toBe(true);
	});

	it("should set label to test", async () => {
		fixture = TestBed.createComponent(TimePickerTest);
		await settle(fixture);
		element = fixture.debugElement.query(By.css("cds-time-picker")).nativeElement;
		expect(element.getAttribute("label")).toEqual("test");
		expect(shadow(element, ".cds--label").textContent.trim()).toEqual("test");
	});

	it("should set theme to dark", () => {
		fixture = TestBed.createComponent(TimePickerTest);
		element = fixture.debugElement.query(By.css("cds-time-picker")).nativeElement;
		expect(element.getAttribute("theme")).toEqual("dark");
	});

	it("should set size to large", async () => {
		fixture = TestBed.createComponent(TimePickerTest);
		await settle(fixture);
		element = fixture.debugElement.query(By.css("cds-time-picker")).nativeElement;
		expect(element.getAttribute("size")).toEqual("lg");
		expect(element.size).toEqual("lg");
	});

	it("should set disabled to false", () => {
		fixture = TestBed.createComponent(TimePickerTest);
		element = fixture.debugElement.query(By.css("cds-time-picker")).nativeElement;
		expect(element.getAttribute("disabled")).toEqual("false");
	});

	it("should set value to 12:12", async () => {
		fixture = TestBed.createComponent(TimePickerTest);
		await settle(fixture);
		expect(input().value).toEqual("12:12");
	});

	it("should call onChange", async () => {
		fixture = TestBed.createComponent(TimePickerTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		spyOn(wrapper, "onChange");
		typeInto(input(), "04:33");
		await settle(fixture);
		expect(wrapper.onChange).toHaveBeenCalled();
		expect(wrapper.value).toEqual("04:33");
	});

	it("should disable input", async () => {
		fixture = TestBed.overrideComponent(TimePickerTest, {
			set: {
				template: `<cds-time-picker disabled="true"></cds-time-picker>`
			}
		}).createComponent(TimePickerTest);
		await settle(fixture);
		expect(input().disabled).toEqual(true);
	});
});

@Component({
	template: `
		<cds-time-picker label="Time" [formControl]="time">
			<cds-time-picker-select [formControl]="period">
				<cds-select-item value="AM">AM</cds-select-item>
				<cds-select-item value="PM">PM</cds-select-item>
			</cds-time-picker-select>
		</cds-time-picker>
	`,
	imports: [TimePicker, TimePickerSelect, ReactiveFormsModule]
})
class TimePickerFormsTest {
	time = new FormControl("10:30");
	period = new FormControl("PM");
}

describe("TimePicker with reactive forms", () => {
	let fixture;
	let picker;
	let select;

	beforeEach(async () => {
		fixture = TestBed.createComponent(TimePickerFormsTest);
		await settle(fixture);
		picker = fixture.nativeElement.querySelector("cds-time-picker");
		select = fixture.nativeElement.querySelector("cds-time-picker-select");
	});

	it("should write the form values", () => {
		expect(shadow<HTMLInputElement>(picker, "input").value).toBe("10:30");
		expect(shadow<HTMLSelectElement>(select, "select").value).toBe("PM");
	});

	it("should update the form values from user input", async () => {
		typeInto(shadow<HTMLInputElement>(picker, "input"), "11:45");
		const periodSelect = shadow<HTMLSelectElement>(select, "select");
		periodSelect.value = "AM";
		periodSelect.dispatchEvent(new Event("input", { bubbles: true }));
		await settle(fixture);
		expect(fixture.componentInstance.time.value).toBe("11:45");
		expect(fixture.componentInstance.period.value).toBe("AM");
	});

	it("should disable with the form controls", async () => {
		fixture.componentInstance.time.disable();
		fixture.componentInstance.period.disable();
		await settle(fixture);
		expect(shadow<HTMLInputElement>(picker, "input").disabled).toBe(true);
		expect(shadow<HTMLSelectElement>(select, "select").disabled).toBe(true);
	});
});
