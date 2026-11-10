import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { settle, shadow } from "../test-helpers/web-components";
import { Select } from "./select.component";

@Component({
	template: `
		<cds-select (valueChange)="onChange($event)" [(ngModel)]="model">
			<option value="option1"> Option 1 </option>
		</cds-select>
		`,
	imports: [FormsModule, Select],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class SelectTest {
	model = null;
	value = null;
	onChange(event) {
		this.value = event;
	}
}

/** Picks an option in the web component's shadow `<select>`, as the user does. */
const choose = (element: Element, value: string) => {
	const select = shadow<HTMLSelectElement>(element, "select");
	select.value = value;
	select.dispatchEvent(new Event("input", { bubbles: true }));
};

describe("Select", () => {
	let fixture, wrapper, element;
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SelectTest
			]
		});
	});

	const create = async (template?: string) => {
		if (template) {
			TestBed.overrideComponent(SelectTest, { set: { template } });
		}
		fixture = TestBed.createComponent(SelectTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		element = fixture.debugElement.query(By.css("cds-select")).nativeElement;
	};

	it("should work", async () => {
		await create();
		expect(fixture.debugElement.query(By.directive(Select)).componentInstance instanceof Select).toBe(true);
		expect(element instanceof customElements.get("cds-select")).toBe(true);
	});

	it("should call onChange on change select and propagate the change back to the form", async () => {
		await create();
		spyOn(wrapper, "onChange").and.callThrough();
		choose(element, "option1");
		await settle(fixture);
		expect(wrapper.onChange).toHaveBeenCalled();
		expect(wrapper.model).toBe("option1");
		expect(wrapper.value).toBe("option1");
		expect(shadow(element, "select").textContent).toContain("Option 1");
	});

	it("should set label to test", async () => {
		await create(`<cds-select label="test"></cds-select>`);
		expect(shadow(element, ".cds--label").textContent.trim()).toEqual("test");
	});

	it("should set helperText to test", async () => {
		await create(`<cds-select helperText="test"></cds-select>`);
		expect(shadow(element, ".cds--form__helper-text").textContent.trim()).toEqual("test");
	});

	it("should set display to inline", async () => {
		await create(`<cds-select display="inline"></cds-select>`);
		expect(shadow(element, ".cds--select-input--inline__wrapper")).toBeTruthy();
	});

	it("should set option to disabled", async () => {
		await create(`
			<cds-select>
				<option value="option1" disabled> Option 1 </option>
			</cds-select>`);
		expect(shadow<HTMLSelectElement>(element, "select").options[0].disabled).toBe(true);
	});

	it("should display warning filled icon and display invalid text", async () => {
		await create(`<cds-select [invalid]=true invalidText="test"></cds-select>`);
		expect(shadow(element, ".cds--select__invalid-icon")).toBeTruthy();
		expect(shadow(element, ".cds--form-requirement").textContent.trim()).toEqual("test");
	});

	it("should render the select skeleton (cds-select-skeleton)", async () => {
		// The web component select has no skeleton state; v7 uses `<cds-select-skeleton>`,
		// which is registered together with `cds-select`.
		await create(`<cds-select /><cds-select-skeleton />`);
		const skeleton = fixture.nativeElement.querySelector("cds-select-skeleton");
		expect(skeleton instanceof customElements.get("cds-select-skeleton")).toBe(true);
		expect(shadow(skeleton, ".cds--skeleton")).toBeTruthy();
	});
});

@Component({
	template: `
		<cds-select label="Reactive" [formControl]="control">
			<option value="a">A</option>
			<optgroup label="Group">
				<option value="b">B</option>
			</optgroup>
		</cds-select>
	`,
	imports: [ReactiveFormsModule, Select]
})
class ReactiveSelectTest {
	control = new FormControl("b");
}

describe("Select with reactive forms", () => {
	let fixture;
	let element;

	beforeEach(async () => {
		fixture = TestBed.createComponent(ReactiveSelectTest);
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-select");
	});

	it("should render <option> and <optgroup> children in the web component", () => {
		const select = shadow<HTMLSelectElement>(element, "select");
		expect(select.querySelector("optgroup").label).toBe("Group");
		expect(Array.from(select.options).map(option => option.value)).toContain("b");
	});

	it("should select the option matching the form value", () => {
		expect(shadow<HTMLSelectElement>(element, "select").value).toBe("b");
	});

	it("should update the form value when an option is chosen", async () => {
		choose(element, "a");
		await settle(fixture);
		expect(fixture.componentInstance.control.value).toBe("a");
	});

	it("should write form values and disable with the control", async () => {
		fixture.componentInstance.control.setValue("a");
		fixture.componentInstance.control.disable();
		await settle(fixture);
		const select = shadow<HTMLSelectElement>(element, "select");
		expect(select.value).toBe("a");
		expect(select.disabled).toBe(true);
	});
});
