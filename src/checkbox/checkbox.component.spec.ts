import { Component, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { Checkbox } from "./checkbox.component";

/** Waits for the Lit web component to finish rendering. */
const rendered = (element: any) => element.updateComplete as Promise<boolean>;
const shadowInput = (element: HTMLElement) => element.shadowRoot.querySelector("input");

@Component({
	template: `
		<cds-checkbox
			[hideLabel]="hideLabel"
			[(indeterminate)]="indeterminate"
			(checkedChange)="onChange($event)"
			[helperText]="helperText"
			[(ngModel)]="model">
			Label
		</cds-checkbox>
		<ng-template #helper><b class="helper">Template helper</b></ng-template>
	`,
	imports: [Checkbox, FormsModule]
})
class CheckboxTest {
	@ViewChild("helper") helperTemplate: TemplateRef<any>;
	model = false;
	hideLabel = false;
	indeterminate = false;
	helperText: string | TemplateRef<any> = "";
	onChange(_: boolean) {}
}

@Component({
	template: `<cds-checkbox [formControl]="control">Label</cds-checkbox>`,
	imports: [Checkbox, ReactiveFormsModule]
})
class ReactiveCheckboxTest {
	control = new FormControl(true);
}


describe("Checkbox", () => {
	it("should register the cds-checkbox web component", () => {
		expect(customElements.get("cds-checkbox")).toBeDefined();
	});

	it("should render the web component as the host element and project the label", async () => {
		const fixture = TestBed.createComponent(CheckboxTest);
		fixture.detectChanges();
		const element = fixture.nativeElement.querySelector("cds-checkbox");
		await rendered(element);

		expect(element instanceof customElements.get("cds-checkbox")).toBe(true);
		expect(element.textContent.trim()).toBe("Label");
		expect(shadowInput(element).checked).toBe(false);
	});

	it("should update ngModel and emit checkedChange when clicked", async () => {
		const fixture = TestBed.createComponent(CheckboxTest);
		const wrapper = fixture.componentInstance;
		spyOn(wrapper, "onChange");
		fixture.detectChanges();
		const element = fixture.nativeElement.querySelector("cds-checkbox");
		await rendered(element);

		shadowInput(element).click();
		fixture.detectChanges();
		await fixture.whenStable();

		expect(wrapper.onChange).toHaveBeenCalledWith(true);
		expect(wrapper.model).toBe(true);
		expect(fixture.debugElement.query(By.directive(Checkbox)).componentInstance.checked).toBe(true);
	});

	it("should write ngModel values to the web component", async () => {
		const fixture = TestBed.createComponent(CheckboxTest);
		fixture.detectChanges();
		fixture.componentInstance.model = true;
		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
		const element = fixture.nativeElement.querySelector("cds-checkbox");
		await rendered(element);

		expect(element.checked).toBe(true);
		expect(shadowInput(element).checked).toBe(true);
	});

	it("should pass inputs through to the web component", async () => {
		const fixture = TestBed.createComponent(CheckboxTest);
		fixture.componentInstance.hideLabel = true;
		fixture.componentInstance.indeterminate = true;
		fixture.detectChanges();
		const element = fixture.nativeElement.querySelector("cds-checkbox");
		await rendered(element);

		expect(element.hideLabel).toBe(true);
		expect(element.shadowRoot.querySelector(".cds--visually-hidden")).toBeTruthy();
		expect(shadowInput(element).indeterminate).toBe(true);
	});

	it("should reset indeterminate (two-way) when clicked", async () => {
		const fixture = TestBed.createComponent(CheckboxTest);
		fixture.componentInstance.indeterminate = true;
		fixture.detectChanges();
		const element = fixture.nativeElement.querySelector("cds-checkbox");
		await rendered(element);

		shadowInput(element).click();
		fixture.detectChanges();

		expect(fixture.componentInstance.indeterminate).toBe(false);
	});

	it("should render TemplateRef helper text inside the web component", async () => {
		const fixture = TestBed.createComponent(CheckboxTest);
		fixture.detectChanges();
		fixture.componentInstance.helperText = fixture.componentInstance.helperTemplate;
		fixture.detectChanges();
		const element = fixture.nativeElement.querySelector("cds-checkbox");
		await rendered(element);

		expect(element.shadowRoot.querySelector(".cds--form__helper-text .helper").textContent).toBe("Template helper");
	});

	it("should support reactive forms, including disabling", async () => {
		const fixture = TestBed.createComponent(ReactiveCheckboxTest);
		fixture.detectChanges();
		const element = fixture.nativeElement.querySelector("cds-checkbox");
		await rendered(element);
		expect(element.checked).toBe(true);

		fixture.componentInstance.control.disable();
		fixture.detectChanges();
		await rendered(element);
		expect(shadowInput(element).disabled).toBe(true);

		fixture.componentInstance.control.enable();
		fixture.detectChanges();
		await rendered(element);
		shadowInput(element).click();
		expect(fixture.componentInstance.control.value).toBe(false);
	});

});
