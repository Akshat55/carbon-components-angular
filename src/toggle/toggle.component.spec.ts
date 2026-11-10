import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { By } from "@angular/platform-browser";
import { rendered, settle, shadow } from "../test-helpers/web-components";
import { Toggle } from "./toggle.component";

// A host template, so the toggle renders on a real `<cds-toggle>` element.
@Component({
	template: `<cds-toggle [size]="size" [checked]="checked" />`,
	imports: [Toggle]
})
class ToggleTest {
	size: "sm" | "md" = "md";
	checked = false;
}

describe("Toggle", () => {
	let component: Toggle;
	let fixture: ComponentFixture<ToggleTest>;
	let element: HTMLElement;
	let buttonElement: HTMLButtonElement;

	beforeEach(async () => {
		fixture = TestBed.createComponent(ToggleTest);
		await settle(fixture);
		const debugElement = fixture.debugElement.query(By.directive(Toggle));
		component = debugElement.componentInstance;
		element = debugElement.nativeElement;
		buttonElement = shadow<HTMLButtonElement>(element, "button");
	});

	it("should work", () => {
		expect(component instanceof Toggle).toBe(true);
		expect(element instanceof customElements.get("cds-toggle")).toBe(true);
	});

	it("should have button with class 'cds--toggle__button'", async () => {
		expect(buttonElement.className.includes("cds--toggle__button")).toEqual(true);
		fixture.componentInstance.size = "sm";
		await settle(fixture);
		expect(shadow(element, "button").className.includes("cds--toggle__button")).toEqual(true);
	});

	it("should change state", async () => {
		buttonElement.click();
		await settle(fixture);
		expect(component.checked).toBe(true, "setting to on");

		buttonElement.click();
		await settle(fixture);
		expect(component.checked).toBe(false, "setting to off");
	});

	it("should display small version of toggle when size equals sm", async () => {
		expect(shadow(element, ".cds--toggle__appearance--sm")).toBeNull();
		fixture.componentInstance.size = "sm";
		await settle(fixture);
		expect(shadow(element, ".cds--toggle__appearance--sm")).not.toBeNull();
	});

	it("should match the input checked value", async () => {
		fixture.componentInstance.checked = true;
		await settle(fixture);
		expect(fixture.componentInstance.checked).toEqual(true);
		expect((element as any).toggled).toBe(true);
		expect(shadow(element, "button").getAttribute("aria-checked")).toBe("true");
	});

	it("should emit boolean event", (done: any) => {
		component.checkedChange.subscribe((data: any) => {
			expect(typeof data === "boolean").toEqual(true);
			done();
		});
		buttonElement.click();
	});

	it("should show the on / off text", async () => {
		const text = () => shadow(element, ".cds--toggle__text").textContent.trim();
		expect(text()).toBe("Off");
		buttonElement.click();
		await settle(fixture);
		expect(text()).toBe("On");
	});
});

@Component({
	template: `
		<cds-toggle label="Notifications" [(ngModel)]="model" />
		<cds-toggle label="Reactive" [formControl]="control" />
	`,
	imports: [Toggle, FormsModule, ReactiveFormsModule]
})
class ToggleFormsTest {
	model = true;
	control = new FormControl(false);
}

describe("Toggle with forms", () => {
	let fixture: ComponentFixture<ToggleFormsTest>;
	let modelToggle: any;
	let reactiveToggle: any;

	beforeEach(async () => {
		fixture = TestBed.createComponent(ToggleFormsTest);
		await settle(fixture);
		[modelToggle, reactiveToggle] = fixture.nativeElement.querySelectorAll("cds-toggle");
	});

	it("should write the ngModel value to the toggle", () => {
		expect(modelToggle.toggled).toBe(true);
	});

	it("should update ngModel when toggled", async () => {
		shadow(modelToggle, "button").click();
		await settle(fixture);
		expect(fixture.componentInstance.model).toBe(false);
	});

	it("should update the form control when toggled", async () => {
		shadow(reactiveToggle, "button").click();
		await settle(fixture);
		expect(fixture.componentInstance.control.value).toBe(true);
		expect(fixture.componentInstance.control.dirty).toBe(true);
	});

	it("should write form control values to the toggle", async () => {
		fixture.componentInstance.control.setValue(true);
		await settle(fixture);
		expect(reactiveToggle.toggled).toBe(true);
	});

	it("should disable the toggle with the form control", async () => {
		fixture.componentInstance.control.disable();
		await settle(fixture);
		await rendered(reactiveToggle);
		expect(shadow<HTMLButtonElement>(reactiveToggle, "button").disabled).toBe(true);
	});

	it("should mark the form control as touched on blur", async () => {
		reactiveToggle.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
		await settle(fixture);
		expect(fixture.componentInstance.control.touched).toBe(true);
	});
});
