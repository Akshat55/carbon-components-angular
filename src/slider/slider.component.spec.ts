import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { settle, shadow } from "../test-helpers/web-components";
import { Slider } from "./slider.component";

@Component({
	template: `
		<cds-slider
			[shiftMultiplier]="shiftMultiplier"
			(valueChange)="onValueChange()"
			[disabled]="disabled"
			[max]="max"
			[min]="min" />
	`,
	imports: [Slider]
})
class SliderTest {
	disabled = false;
	max = 100;
	min = 0;
	shiftMultiplier = 28;
	onValueChange() {}
}

describe("Slider", () => {
	let fixture, element, wrapper, slider;
	const thumb = () => shadow<HTMLElement>(slider, ".cds--slider__thumb");
	const press = async (key: string, shiftKey = false) => {
		thumb().dispatchEvent(new KeyboardEvent("keydown", { key, shiftKey, bubbles: true, composed: true }));
		await settle(fixture);
	};
	const setValue = async (value: any) => {
		element.componentInstance.value = value;
		await settle(fixture);
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SliderTest
			]
		});
	});

	beforeEach(async () => {
		fixture = TestBed.createComponent(SliderTest);
		element = fixture.debugElement.query(By.css("cds-slider"));
		wrapper = fixture.componentInstance;
		await settle(fixture);
		slider = element.nativeElement;
	});

	it("should work", () => {
		expect(element.componentInstance instanceof Slider).toBe(true);
		expect(slider instanceof customElements.get("cds-slider")).toBe(true);
	});

	it("should start dragging on pointerdown on the thumb", () => {
		thumb().dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
		// The web component's drag state (v6 exposed it as `isMouseDown`).
		expect(slider._dragging).toBe(true);
	});

	it("should increment value by 1 on ArrowRight KeyboardEvent", async () => {
		spyOn(wrapper, "onValueChange");
		await press("ArrowRight");
		expect(element.componentInstance.value).toBe(1);
		expect(wrapper.onValueChange).toHaveBeenCalled();
	});

	it("should decrement value by 1 on ArrowLeft KeyboardEvent", async () => {
		await setValue(100);
		spyOn(wrapper, "onValueChange");
		await press("ArrowLeft");
		expect(element.componentInstance.value).toBe(99);
		expect(wrapper.onValueChange).toHaveBeenCalled();
	});

	it("should increment value on Shift + ArrowRight KeyboardEvent by the given shiftMultiplier", async () => {
		spyOn(wrapper, "onValueChange");
		await press("ArrowRight", true);
		expect(element.componentInstance.value).toBe(28);
		expect(wrapper.onValueChange).toHaveBeenCalled();

		wrapper.shiftMultiplier = 5;
		await settle(fixture);
		await press("ArrowRight", true);
		expect(element.componentInstance.value).toBe(33);
	});

	it("should decrement value on Shift + ArrowLeft KeyboardEvent by the given shiftMultiplier", async () => {
		await setValue(100);
		spyOn(wrapper, "onValueChange");
		await press("ArrowLeft", true);
		expect(element.componentInstance.value).toBe(72);
		expect(wrapper.onValueChange).toHaveBeenCalled();

		wrapper.shiftMultiplier = 5;
		await settle(fixture);
		await press("ArrowLeft", true);
		expect(element.componentInstance.value).toBe(67);
	});

	it("should set value to max value when input value is greater than the max value", async () => {
		spyOn(wrapper, "onValueChange");
		await setValue("1984");
		expect(element.componentInstance.value).toBe(100);
		expect(slider.value).toBe(100);
		expect(wrapper.onValueChange).toHaveBeenCalled();
	});

	it("should set value to min value when input value is less than the min value", async () => {
		spyOn(wrapper, "onValueChange");
		await setValue("-1984");
		expect(element.componentInstance.value).toBe(0);
		expect(wrapper.onValueChange).toHaveBeenCalled();
	});

	it("should set cds--slider--disabled class", async () => {
		wrapper.disabled = true;
		await settle(fixture);
		expect(shadow(slider, ".cds--slider--disabled")).toBeTruthy();
	});

	it("should set the value of the right thumb if it's closer on click of the slider", async () => {
		await setValue([0, 90]);
		const track = shadow<HTMLElement>(slider, ".cds--slider__track");
		shadow(slider, ".cds--slider").dispatchEvent(new MouseEvent("click", { clientX: track.getBoundingClientRect().right }));
		await settle(fixture);
		expect(element.componentInstance.value).toEqual([0, 100]);
	});

	it("should set the value of the left thumb if it's closer on click of the slider", async () => {
		await setValue([10, 100]);
		const track = shadow<HTMLElement>(slider, ".cds--slider__track");
		shadow(slider, ".cds--slider").dispatchEvent(new MouseEvent("click", { clientX: track.getBoundingClientRect().left }));
		await settle(fixture);
		expect(element.componentInstance.value).toEqual([0, 100]);
	});
});

@Component({
	template: `
		<cds-slider label="Volume" [(ngModel)]="model" />
		<cds-slider label="Range" [formControl]="control" />
	`,
	imports: [Slider, FormsModule, ReactiveFormsModule]
})
class SliderFormsTest {
	model = 40;
	control = new FormControl<number[]>([20, 60]);
}

describe("Slider with forms", () => {
	let fixture;
	let single;
	let range;

	beforeEach(async () => {
		fixture = TestBed.createComponent(SliderFormsTest);
		await settle(fixture);
		[single, range] = fixture.nativeElement.querySelectorAll("cds-slider");
	});

	it("should write the ngModel and range values to the web component", () => {
		expect(single.value).toBe(40);
		expect(range.value).toBe(20);
		expect(range.unstable_valueUpper).toBe(60);
	});

	it("should update ngModel from the keyboard", async () => {
		const thumb = shadow(single, ".cds--slider__thumb");
		thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, composed: true }));
		await settle(fixture);
		expect(fixture.componentInstance.model).toBe(41);
	});

	it("should update the range form value from the upper thumb", async () => {
		shadow(range, "#thumb-upper").dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, composed: true }));
		await settle(fixture);
		expect(fixture.componentInstance.control.value).toEqual([20, 59]);
	});

	it("should disable the slider with the form control", async () => {
		fixture.componentInstance.control.disable();
		await settle(fixture);
		expect(shadow(range, ".cds--slider--disabled")).toBeTruthy();
	});
});
