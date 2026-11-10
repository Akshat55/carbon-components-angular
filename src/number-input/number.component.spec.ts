import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { settle, shadow, typeInto } from "../test-helpers/web-components";
import { Number } from "./number.component";

@Component({
	template: `
		<cds-number-input
			[value]="value"
			[min]="min"
			[max]="max"
			[step]="step"
			[disabled]="disabled"
			[required]="required"
			[label]="label"
			[helperText]="helperText"
			[theme]="theme" />
	`,
	imports: [Number]
})
class NumberTest {
	value: number = null;
	min: number = null;
	max: number = null;
	step = 1;
	disabled = false;
	required = false;
	label: string = null;
	helperText: string;
	theme: "light" | "dark" = "dark";
}

describe("Number", () => {
	let host: NumberTest;
	let component: Number;
	let fixture: ComponentFixture<NumberTest>;
	let numberInput: any;
	let inputElement: () => HTMLInputElement;
	let buttonUp: () => HTMLButtonElement;
	let buttonDown: () => HTMLButtonElement;

	const update = async (changes: Partial<NumberTest>) => {
		Object.assign(host, changes);
		await settle(fixture);
	};

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [FormsModule, NumberTest]
		});
		fixture = TestBed.createComponent(NumberTest);
		host = fixture.componentInstance;
		await settle(fixture);
		component = fixture.debugElement.query(By.directive(Number)).componentInstance;
		numberInput = fixture.nativeElement.querySelector("cds-number-input");
		inputElement = () => shadow<HTMLInputElement>(numberInput, "input");
		buttonUp = () => shadow<HTMLButtonElement>(numberInput, ".up-icon");
		buttonDown = () => shadow<HTMLButtonElement>(numberInput, ".down-icon");
	});

	it("should work", () => {
		expect(component instanceof Number).toBe(true);
		expect(numberInput instanceof customElements.get("cds-number-input")).toBe(true);
	});

	it("should bind input value", async () => {
		await update({ value: 1 });
		expect(inputElement().value).toEqual("1");
	});

	it("should bind input min", async () => {
		await update({ min: 0 });
		expect(inputElement().min).toEqual("0");
	});

	it("should bind input max", async () => {
		await update({ max: 100 });
		expect(inputElement().max).toEqual("100");
	});

	it("should bind input disabled", async () => {
		expect(inputElement().disabled).toEqual(false);
		await update({ disabled: true });
		expect(inputElement().disabled).toEqual(true);
	});

	it("should bind input required", async () => {
		await update({ required: true });
		expect(inputElement().required).toEqual(true);
	});

	it("should bind input label", async () => {
		await update({ label: "Number Input" });
		expect(shadow(numberInput, "label").textContent).toContain("Number Input");

		await update({ label: null });
		expect(shadow(numberInput, "label")?.textContent.trim() ?? "").toBe("");
	});

	it("should bind input helperText", async () => {
		await update({ helperText: "Helper text here." });
		expect(shadow(numberInput, ".cds--form__helper-text").textContent).toContain("Helper text here.");
	});

	it("should display control buttons", () => {
		expect(buttonUp().className.includes("cds--number__control-btn")).toEqual(true);
		expect(buttonDown().className.includes("cds--number__control-btn")).toEqual(true);
	});

	it("should increment value when button up is clicked", async () => {
		await update({ value: 1 });
		buttonUp().click();
		await settle(fixture);
		expect(component.value).toEqual(2);
	});

	it("should increment and set value to max if value + step exceeds max", async () => {
		await update({ value: 95, step: 10, max: 100 });
		buttonUp().click();
		await settle(fixture);
		expect(component.value).toEqual(100);
	});

	it("should increment and set value to min if value + step is less than min", async () => {
		await update({ value: 0, step: 2, min: 5 });
		buttonUp().click();
		await settle(fixture);
		expect(component.value).toBe(5);
	});

	it("should not increment value if max is reached", async () => {
		await update({ value: 100, max: 100 });
		buttonUp().click();
		await settle(fixture);
		expect(component.value).toEqual(100);
	});

	it("should decrement value when button down is clicked", async () => {
		await update({ value: 1 });
		buttonDown().click();
		await settle(fixture);
		expect(component.value).toEqual(0);
	});

	it("should decrement and set value to max if value - step exceeds max", async () => {
		await update({ value: 20, step: 2, max: 15 });
		buttonDown().click();
		await settle(fixture);
		expect(component.value).toBe(15);
	});

	it("should decrement and set value to min if value - step is less than min", async () => {
		await update({ value: 6, step: 2, min: 5 });
		buttonDown().click();
		await settle(fixture);
		expect(component.value).toEqual(5);
	});

	it("should not decrement value min is reached", async () => {
		await update({ value: 0, min: 0 });
		buttonDown().click();
		await settle(fixture);
		expect(component.value).toEqual(0);
	});

	it("should emit change with the new value", async () => {
		const change = jasmine.createSpy("change");
		component.change.subscribe(change);
		await update({ value: 3 });
		buttonUp().click();
		await settle(fixture);
		expect(change).toHaveBeenCalledWith(jasmine.objectContaining({ value: 4 }));
	});
});

@Component({
	template: `
		<cds-number-input label="Model" [(ngModel)]="model" />
		<cds-number-input label="Reactive" [formControl]="control" [precision]="1" />
	`,
	imports: [Number, FormsModule, ReactiveFormsModule]
})
class NumberFormsTest {
	model = 5;
	control = new FormControl<number>(2);
}

describe("Number with forms", () => {
	let fixture: ComponentFixture<NumberFormsTest>;
	let modelInput: any;
	let reactiveInput: any;

	beforeEach(async () => {
		fixture = TestBed.createComponent(NumberFormsTest);
		await settle(fixture);
		[modelInput, reactiveInput] = fixture.nativeElement.querySelectorAll("cds-number-input");
	});

	it("should write the ngModel value to the input", () => {
		expect(shadow<HTMLInputElement>(modelInput, "input").value).toBe("5");
	});

	it("should update ngModel when the user types", async () => {
		typeInto(shadow<HTMLInputElement>(modelInput, "input"), "8");
		await settle(fixture);
		expect(fixture.componentInstance.model).toBe(8);
	});

	it("should update ngModel from the stepper buttons", async () => {
		shadow<HTMLButtonElement>(modelInput, ".up-icon").click();
		await settle(fixture);
		expect(fixture.componentInstance.model).toBe(6);
	});

	it("should write null for an empty input", async () => {
		typeInto(shadow<HTMLInputElement>(modelInput, "input"), "");
		await settle(fixture);
		expect(fixture.componentInstance.model).toBeNull();
	});

	it("should round the form value to `precision`", async () => {
		typeInto(shadow<HTMLInputElement>(reactiveInput, "input"), "1.26");
		await settle(fixture);
		expect(fixture.componentInstance.control.value).toBe(1.3);
	});

	it("should write form control values to the input", async () => {
		fixture.componentInstance.control.setValue(9);
		await settle(fixture);
		expect(shadow<HTMLInputElement>(reactiveInput, "input").value).toBe("9");
	});

	it("should disable the input with the form control", async () => {
		fixture.componentInstance.control.disable();
		await settle(fixture);
		expect(shadow<HTMLInputElement>(reactiveInput, "input").disabled).toBe(true);
	});
});
