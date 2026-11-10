import { Component, CUSTOM_ELEMENTS_SCHEMA, Type } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ComboBox } from "carbon-components-angular/combobox";
import { DatePicker } from "carbon-components-angular/datepicker";
import { Dropdown, DropdownList, MultiSelect } from "carbon-components-angular/dropdown";
import { CdsPasswordInput, CdsTextarea, CdsTextInput } from "carbon-components-angular/input";
import { NumberComponent } from "carbon-components-angular/number-input";
import { Radio, RadioGroup } from "carbon-components-angular/radio";
import { Search } from "carbon-components-angular/search";
import { Slider } from "carbon-components-angular/slider";
import { TimePicker } from "carbon-components-angular/timepicker";
import { Select } from "carbon-components-angular/select";
import { StructuredListModule } from "carbon-components-angular/structured-list";
import { Toggle } from "carbon-components-angular/toggle";

/**
 * `ngModel` / reactive forms round trips for every web component form control:
 * the model value reaches the web component, a user change updates the model,
 * and disabling the control disables the web component.
 */
interface FormCase {
	name: string;
	imports: Type<any>[];
	/** Template with `[formControl]="control"` on the control. */
	template: string;
	initial: any;
	/** Element whose state reflects the value. */
	tag: string;
	/** Reads the displayed value from the web component. */
	read: (element: any) => any;
	/** Simulates a user change; returns the expected model value. */
	change: (element: any) => any;
	/** Element that receives `disabled` (defaults to `tag`). */
	disabledTag?: string;
}

const typeInto = (element: any, value: string) => {
	element.value = value;
	element.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
	return value;
};

const items = () => [
	{ content: "One", id: 1, selected: false },
	{ content: "Two", id: 2, selected: false },
	{ content: "Three", id: 3, selected: false }
];

/** Fires the web component's selection event for the item at `index` (web components may reorder items). */
const pick = (element: any, itemTag: string, eventName: string, index: number) => {
	const item = Array.from<any>(element.querySelectorAll(itemTag)).find(el => el.value === String(index));
	item.selected = true;
	element.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: { item } }));
};

const cases: FormCase[] = [
	{
		name: "Dropdown (itemValueKey)",
		imports: [Dropdown, DropdownList],
		template: `<cds-dropdown label="Pick" itemValueKey="id" [formControl]="control"><cds-dropdown-list [items]="items" /></cds-dropdown>`,
		initial: 2,
		tag: "cds-dropdown",
		// The web component value is the selected item's index.
		read: element => items()[Number(element.value)]?.id,
		change: element => {
			pick(element, "cds-dropdown-item", "cds-dropdown-selected", 2);
			return 3;
		}
	},
	{
		name: "MultiSelect",
		imports: [MultiSelect, DropdownList],
		template: `<cds-multi-select label="Pick" itemValueKey="id" [formControl]="control"><cds-dropdown-list [items]="items" /></cds-multi-select>`,
		initial: [1],
		tag: "cds-multi-select",
		read: element => Array.from<any>(element.querySelectorAll("cds-multi-select-item"))
			.filter(item => item.selected)
			.map(item => items()[Number(item.value)].id),
		change: element => {
			pick(element, "cds-multi-select-item", "cds-multi-select-selected", 2);
			return [1, 3];
		}
	},
	{
		name: "ComboBox",
		imports: [ComboBox],
		template: `<cds-combo-box label="Pick" itemValueKey="id" [items]="items" [formControl]="control" />`,
		initial: 1,
		tag: "cds-combo-box",
		read: element => Number(element.value) + 1,
		change: element => {
			pick(element, "cds-combo-box-item", "cds-combo-box-selected", 1);
			return 2;
		}
	},
	{
		name: "Slider",
		imports: [Slider],
		template: `<cds-slider label="Volume" [min]="0" [max]="10" [formControl]="control" />`,
		initial: 4,
		tag: "cds-slider",
		read: element => Number(element.value),
		change: element => {
			element.value = 6;
			element.dispatchEvent(new CustomEvent("cds-slider-changed", { bubbles: true, detail: { value: 6 } }));
			return 6;
		}
	},
	{
		name: "TimePicker",
		imports: [TimePicker],
		template: `<cds-time-picker label="Time" [formControl]="control" />`,
		initial: "10:30",
		tag: "cds-time-picker",
		read: element => element.value,
		change: element => typeInto(element, "11:45")
	},
	{
		name: "DatePicker",
		imports: [DatePicker],
		template: `<cds-date-picker label="Date" [formControl]="control" />`,
		initial: [new Date(2024, 0, 15)],
		tag: "cds-date-picker",
		read: element => element.value === "2024-01-15" ? [new Date(2024, 0, 15)] : element.value,
		change: element => {
			const dates = [new Date(2024, 1, 2)];
			element.dispatchEvent(new CustomEvent("cds-date-picker-changed", { bubbles: true, detail: { selectedDates: dates } }));
			return dates;
		},
		disabledTag: ""
	},
	{
		name: "CdsTextInput",
		imports: [CdsTextInput],
		template: `<cds-text-input label="Name" [formControl]="control" />`,
		initial: "Ada",
		tag: "cds-text-input",
		read: element => element.value,
		change: element => typeInto(element, "Grace")
	},
	{
		name: "CdsTextarea",
		imports: [CdsTextarea],
		template: `<cds-textarea label="Bio" [formControl]="control" />`,
		initial: "Hello",
		tag: "cds-textarea",
		read: element => element.value,
		change: element => typeInto(element, "World")
	},
	{
		name: "CdsPasswordInput",
		imports: [CdsPasswordInput],
		template: `<cds-password-input label="Password" [formControl]="control" />`,
		initial: "secret",
		tag: "cds-password-input",
		read: element => element.value,
		change: element => typeInto(element, "hunter2")
	},
	{
		name: "Number",
		imports: [NumberComponent],
		template: `<cds-number-input label="Count" [formControl]="control" />`,
		initial: 3,
		tag: "cds-number-input",
		read: element => Number(element.value),
		change: element => Number(typeInto(element, "7"))
	},
	{
		name: "Search",
		imports: [Search],
		template: `<cds-search [formControl]="control" />`,
		initial: "query",
		tag: "cds-search",
		read: element => element.value,
		change: element => {
			element.dispatchEvent(new CustomEvent("cds-search-input", { bubbles: true, detail: { value: "next" } }));
			return "next";
		}
	},
	{
		name: "Select",
		imports: [Select],
		template: `
			<cds-select label="Pick" [formControl]="control">
				<option value="a">A</option>
				<option value="b">B</option>
			</cds-select>`,
		initial: "a",
		tag: "cds-select",
		read: element => element.value,
		change: element => {
			const select = element.shadowRoot.querySelector("select");
			select.value = "b";
			select.dispatchEvent(new Event("input", { bubbles: true }));
			return "b";
		}
	},
	{
		name: "Toggle",
		imports: [Toggle],
		template: `<cds-toggle label="On?" [formControl]="control" />`,
		initial: true,
		tag: "cds-toggle",
		read: element => element.toggled,
		change: element => {
			element.shadowRoot.querySelector("button").click();
			return false;
		}
	},
	{
		name: "RadioGroup",
		imports: [RadioGroup, Radio],
		template: `
			<cds-radio-button-group legend="Pick" [formControl]="control">
				<cds-radio-button [value]="1">One</cds-radio-button>
				<cds-radio-button [value]="2">Two</cds-radio-button>
			</cds-radio-button-group>`,
		initial: 1,
		tag: "cds-radio-button",
		read: element => element.checked ? 1 : null,
		change: element => {
			const second = element.parentElement.parentElement.querySelectorAll("cds-radio-button")[1];
			second.click();
			return 2;
		},
		disabledTag: "cds-radio-button-group"
	},
	{
		name: "StructuredList (selection)",
		imports: [StructuredListModule],
		template: `
			<cds-structured-list [selection]="true" [formControl]="control"><cds-structured-list-body>
				<cds-structured-list-row value="a"><cds-structured-list-cell>A</cds-structured-list-cell></cds-structured-list-row>
				<cds-structured-list-row value="b"><cds-structured-list-cell>B</cds-structured-list-cell></cds-structured-list-row>
			</cds-structured-list-body></cds-structured-list>`,
		initial: "a",
		tag: "cds-structured-list-row",
		read: element => element.selected ? "a" : null,
		change: element => {
			element.closest("cds-structured-list").querySelectorAll("cds-structured-list-row")[1].click();
			return "b";
		},
		disabledTag: ""
	}
];

describe("Web component form controls", () => {
	cases.forEach(({ name, imports, template, initial, tag, read, change, disabledTag }) => {
		describe(name, () => {
			@Component({ template, imports: [...imports, FormsModule, ReactiveFormsModule], schemas: [CUSTOM_ELEMENTS_SCHEMA] })
			class Host {
				control = new FormControl<any>(initial);
				items = items();
			}

			let fixture;
			let element;

			const settle = async () => {
				fixture.detectChanges();
				await fixture.whenStable();
				fixture.detectChanges();
				await element.updateComplete;
			};

			beforeEach(async () => {
				fixture = TestBed.createComponent(Host);
				fixture.detectChanges();
				element = fixture.nativeElement.querySelector(tag);
				await settle();
			});

			it("should write the form value to the web component", () => {
				expect(element instanceof (customElements.get(tag) as any)).withContext("upgraded").toBe(true);
				expect(read(element)).toEqual(initial);
			});

			it("should update the form value on user changes", async () => {
				const expected = change(element);
				await settle();
				expect(fixture.componentInstance.control.value).toEqual(expected);
			});

			if (disabledTag !== "") {
				it("should disable the web component with the form control", async () => {
					fixture.componentInstance.control.disable();
					await settle();
					expect(fixture.nativeElement.querySelector(disabledTag || tag).disabled).toBe(true);
				});
			}
		});
	});
});
