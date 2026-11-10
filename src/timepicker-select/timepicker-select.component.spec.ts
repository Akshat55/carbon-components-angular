import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Component } from "@angular/core";

import { settle, shadow } from "../test-helpers/web-components";
import { TimePickerSelect } from "./timepicker-select.component";

@Component({
	template: `
	<cds-timepicker-select (valueChange)="onChange($event)">
		<option class="test" selected value="AM">AM</option>
		<option class="test2" value="PM">PM</option>
	</cds-timepicker-select>
	`,
	imports: [TimePickerSelect]
})
class TimePickerSelectTest {
	onChange(event) {}
}

describe("TimePickerSelect", () => {
	let fixture, wrapper, element;
	const select = () => shadow<HTMLSelectElement>(fixture.nativeElement.querySelector("cds-time-picker-select"), "select");

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				TimePickerSelectTest
			]
		});
	});

	it("should work", async () => {
		fixture = TestBed.createComponent(TimePickerSelectTest);
		await settle(fixture);
		expect(fixture.debugElement.query(By.directive(TimePickerSelect)).componentInstance instanceof TimePickerSelect).toBe(true);
		expect(fixture.nativeElement.querySelector("cds-time-picker-select") instanceof customElements.get("cds-time-picker-select"))
			.toBe(true);
	});

	it("should call onChange on change select", async () => {
		fixture = TestBed.createComponent(TimePickerSelectTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		spyOn(wrapper, "onChange");
		select().value = "PM";
		select().dispatchEvent(new Event("input", { bubbles: true }));
		await settle(fixture);
		expect(wrapper.onChange).toHaveBeenCalledWith("PM");
	});

	it("should set options to AM and PM", async () => {
		fixture = TestBed.createComponent(TimePickerSelectTest);
		await settle(fixture);
		const options = Array.from(select().options);
		expect(options.map(option => option.textContent.trim())).toEqual(["AM", "PM"]);
		expect(options.map(option => option.value)).toEqual(["AM", "PM"]);
	});

	it("should select the option marked selected", async () => {
		fixture = TestBed.createComponent(TimePickerSelectTest);
		await settle(fixture);
		expect(select().value).toBe("AM");
	});

	it("should set label to test-label", async () => {
		fixture = TestBed.overrideComponent(TimePickerSelectTest, {
			set: {
				template: `<cds-timepicker-select label="test-label"></cds-timepicker-select>`
			}
		}).createComponent(TimePickerSelectTest);
		await settle(fixture);
		// The web component has no visible label; it is used as the accessible name.
		element = fixture.nativeElement.querySelector("cds-time-picker-select");
		expect(element.getAttribute("aria-label")).toEqual("test-label");
	});

	it("should set disabled on the underlying select to true", async () => {
		fixture = TestBed.overrideComponent(TimePickerSelectTest, {
			set: {
				template: `<cds-timepicker-select [disabled]="true"></cds-timepicker-select>`
			}
		}).createComponent(TimePickerSelectTest);
		await settle(fixture);
		expect(select().disabled).toEqual(true);
	});
});
