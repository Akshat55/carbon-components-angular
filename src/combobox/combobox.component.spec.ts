import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { DropdownList, ListItem, MultiSelect } from "carbon-components-angular/dropdown";
import { settle, shadow, typeInto } from "../test-helpers/web-components";
import { ComboBox } from "./combobox.component";

@Component({
	template: `
	<cds-combo-box
		placeholder="placeholder"
		label="label"
		[items]="items"
		[(ngModel)]="model"
		[itemValueKey]="itemValueKey"
		(search)="onSearch($event)">
		<cds-dropdown-list />
	</cds-combo-box>`,
	imports: [
		ComboBox,
		DropdownList,
		FormsModule
	]
})
class ComboboxTest {
	items = [
		{ id: "1", content: "one", selected: false },
		{ id: "2", content: "two", selected: false },
		{ id: "3", content: "three", selected: false }
	];
	itemValueKey = undefined;
	model: ListItem | ListItem[];
	onSearch(_: string) {}
}

@Component({
	template: `
	<cds-combo-box
		placeholder="placeholder"
		label="label"
		[items]="items"
		[dropUp]="dropUp"
		[itemValueKey]="itemValueKey">
		<cds-dropdown-list></cds-dropdown-list>
	</cds-combo-box>`,
	imports: [
		ComboBox,
		DropdownList
	]
})
class ComboboxTestNoModel {
	items = [
		{id: "1", content: "one", selected: false},
		{id: "2", content: "two", selected: false},
		{id: "3", content: "three", selected: false}
	];
	itemValueKey = undefined;
	dropUp = false;
}

/** The web component trigger, items, filter input and clear button. */
const trigger = (element: Element) => shadow<HTMLElement>(element, ".cds--list-box__field");
const items = (element: Element): any[] => Array.from(element.querySelectorAll("cds-combo-box-item"));
const input = (element: Element) => shadow<HTMLInputElement>(element, "input");
const clearButton = (element: Element) => shadow<HTMLElement>(element, ".cds--list-box__selection");
const expanded = (element: Element) => shadow(element, ".cds--list-box").classList.contains("cds--list-box--expanded");

describe("Combo box", () => {
	let fixture, wrapper, element, combobox: ComboBox;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				ComboboxTest,
				ComboboxTestNoModel
			]
		});
	});

	const create = async (type: any, changes: Record<string, any> = {}) => {
		fixture = TestBed.createComponent(type);
		wrapper = fixture.componentInstance;
		Object.assign(wrapper, changes);
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-combo-box");
		combobox = fixture.debugElement.query(By.css("cds-combo-box")).componentInstance;
	};

	const pick = async (index: number) => {
		trigger(element).click();
		await settle(fixture);
		items(element)[index].click();
		await settle(fixture);
	};

	it("should work", async () => {
		await create(ComboboxTest);
		expect(combobox instanceof ComboBox).toBe(true);
		expect(element instanceof customElements.get("cds-combo-box")).toBe(true);
	});

	it("should change the placeholder value upon selection and propagate changes back to the form", async () => {
		await create(ComboboxTest);
		await pick(0);

		expect(input(element).value).toBe("one");
		expect((wrapper.model as ListItem).id).toBe("1");
		expect((wrapper.model as ListItem).content).toBe("one");
		expect((wrapper.model as ListItem).selected).toBe(true);

		combobox.clearSelected();
		await settle(fixture);

		// No longer emits null when selection is empty.
		expect(wrapper.model).toEqual([]);
	});

	it("should clear the selection with the clear button", async () => {
		await create(ComboboxTest);
		await pick(0);
		const clear = jasmine.createSpy("clear");
		combobox.clear.subscribe(clear);

		clearButton(element).click();
		await settle(fixture);

		expect(clear).toHaveBeenCalled();
		expect(wrapper.model).toEqual([]);
	});

	it("should open dropdown on ArrowDown and close dropdown on Escape", async () => {
		await create(ComboboxTest);
		input(element).dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, composed: true }));
		await settle(fixture);
		expect(combobox.open).toBe(true);

		input(element).dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true }));
		await settle(fixture);
		expect(combobox.open).toBe(false);
	});

	it("should call onSearch on input event", async () => {
		await create(ComboboxTest);
		spyOn(wrapper, "onSearch");
		typeInto(input(element), "t");
		await settle(fixture);
		expect(wrapper.onSearch).toHaveBeenCalledWith("t");
	});

	it("should set label to 'label'", async () => {
		await create(ComboboxTest);
		expect(element.titleText).toBe("label");
		expect(shadow(element, ".cds--label").textContent.trim()).toBe("label");
	});

	it("should set placeholder to 'placeholder'", async () => {
		await create(ComboboxTest);
		expect(input(element).getAttribute("placeholder")).toBe("placeholder");
	});

	it("should filter the items by the search text", async () => {
		await create(ComboboxTest);
		typeInto(input(element), "t");
		await settle(fixture);
		expect(items(element).map(item => item.textContent.trim())).toEqual(["two", "three"]);
	});

	it("should display dropdown list when new items are passed that match the current search string", async () => {
		await create(ComboboxTest);
		typeInto(input(element), "f");
		wrapper.items = [
			{ id: "4", content: "four", selected: false },
			{ id: "5", content: "five", selected: false },
			{ id: "6", content: "six", selected: false }
		];
		await settle(fixture);

		expect(items(element).length).toEqual(2);
	});

	it("should update model by itemValueKey when specified", async () => {
		await create(ComboboxTest, { itemValueKey: "id" });
		await pick(0);
		expect(wrapper.model).toEqual("1");
	});

	it("should ignore selected property from the items when using a form control", async () => {
		await create(ComboboxTestNoModel, { itemValueKey: "id" });
		expect(combobox.selectedItems).toEqual([]);

		combobox.registerOnChange(() => {});
		combobox.writeValue(null);
		wrapper.items = wrapper.items.map((item, i) => ({ ...item, selected: i === 0 }));
		await settle(fixture);

		expect(combobox.selectedItems).toEqual([]);
	});

	it("should automatically reselect the written value when items are updated", async () => {
		await create(ComboboxTestNoModel, { itemValueKey: "id" });
		combobox.writeValue("1");
		await settle(fixture);
		expect(combobox.selectedItems[0].id).toEqual("1");

		wrapper.items = [...wrapper.items, { id: "4", content: "four", selected: false }];
		await settle(fixture);

		expect(combobox.selectedItems[0].id).toEqual("1");
		expect(input(element).value).toBe("one");
	});

	it("should update the written value if the user manually changes the selection", async () => {
		const onChange = jasmine.createSpy("onChange");
		await create(ComboboxTestNoModel, { itemValueKey: "id" });
		combobox.registerOnChange(onChange);
		combobox.writeValue("2");
		await settle(fixture);

		await pick(0);

		expect(onChange).toHaveBeenCalledWith("1");
	});

	it("should show the picked item in the input", async () => {
		await create(ComboboxTestNoModel);
		combobox.openDropdown();
		await settle(fixture);
		expect(expanded(element)).toBe(true);

		items(element)[1].click();
		await settle(fixture);

		expect(input(element).value).toBe("two");
		expect(combobox.open).toBe(false);
		expect(expanded(element)).toBe(false);
	});

	it("should show the clear button once an item is picked", async () => {
		await create(ComboboxTestNoModel);
		expect(clearButton(element)).toBeFalsy();

		await pick(0);

		expect(clearButton(element)).toBeTruthy();
	});

	it("should collapse the list box when focus leaves it", async () => {
		await create(ComboboxTestNoModel);
		combobox.openDropdown();
		await settle(fixture);
		expect(expanded(element)).toBe(true);

		element.dispatchEvent(new FocusEvent("focusout", { relatedTarget: document.body }));
		await settle(fixture);

		expect(combobox.open).toBe(false);
		expect(expanded(element)).toBe(false);
	});

	it("should open upwards when dropUp is set", async () => {
		await create(ComboboxTestNoModel, { dropUp: true });
		expect(element.direction).toBe("top");
	});
});

@Component({
	template: `
		<cds-multi-select filterable label="Pick" itemValueKey="id" [(ngModel)]="model" [items]="multiItems" />
		<cds-combo-box label="Reactive" itemValueKey="id" [items]="items" [formControl]="control" />`,
	imports: [MultiSelect, ComboBox, FormsModule, ReactiveFormsModule]
})
class ComboboxFormsTest {
	model: string[] = [];
	control = new FormControl("2");
	// Each control keeps its selection on its own item objects.
	multiItems = [
		{ id: "1", content: "one", selected: false },
		{ id: "2", content: "two", selected: false },
		{ id: "3", content: "three", selected: false }
	];
	items = [
		{ id: "1", content: "one", selected: false },
		{ id: "2", content: "two", selected: false },
		{ id: "3", content: "three", selected: false }
	];
}

describe("Combo box with forms", () => {
	let fixture;
	let multi;
	let combo;

	beforeEach(async () => {
		fixture = TestBed.createComponent(ComboboxFormsTest);
		await settle(fixture);
		multi = fixture.nativeElement.querySelector("cds-multi-select");
		combo = fixture.nativeElement.querySelector("cds-combo-box");
	});

	it("should update the model by itemValueKey for multiple selection (filterable multi-select)", async () => {
		expect(multi.filterable).toBe(true);
		Array.from<any>(multi.querySelectorAll("cds-multi-select-item")).find(item => item.value === "0").click();
		await settle(fixture);
		expect(fixture.componentInstance.model).toEqual(["1"]);
		expect(shadow(multi, "#selection-button .cds--tag__label").textContent.trim()).toBe("1");
	});

	it("should show the reactive form value and update it", async () => {
		expect(input(combo).value).toBe("two");
		trigger(combo).click();
		await settle(fixture);
		items(combo)[2].click();
		await settle(fixture);
		expect(fixture.componentInstance.control.value).toBe("3");
	});

	it("should disable the combo box with the form control", async () => {
		fixture.componentInstance.control.disable();
		await settle(fixture);
		expect(input(combo).disabled).toBe(true);
	});
});
