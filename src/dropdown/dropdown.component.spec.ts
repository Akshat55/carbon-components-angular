import { Component, Input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { settle, shadow } from "../test-helpers/web-components";
import { Dropdown, MultiSelect } from "./dropdown.component";
import { DropdownList } from "./list/dropdown-list.component";
import { ListItem } from "./list-item.interface";

@Component({
	template: `
	<cds-dropdown
		placeholder="test"
		class="custom-class"
		[isOpen]="isOpen"
		(selected)="onSelect()"
		[(ngModel)]="model">
		<cds-dropdown-list [items]="items" />
	</cds-dropdown>`,
	imports: [
		Dropdown,
		DropdownList,
		FormsModule
	]
})
class DropdownTest {
	model = null;
	items = [{ content: "one", id: 0, selected: false }, { content: "two", id: 1, selected: false }];
	selected: ListItem;
	@Input() isOpen = false;
	onSelect() {}
}

@Component({
	template: `
	<cds-dropdown
		placeholder="test"
		class="custom-class"
		[itemValueKey]="itemValueKey"
		[allowNullValues]="allowNullValues"
		[disabled]="disabled"
		[dropUp]="dropUp"
		(selected)="onSelect()">
		<cds-dropdown-list [items]="items"></cds-dropdown-list>
	</cds-dropdown>`,
	imports: [
		Dropdown,
		DropdownList
	]
})
class DropdownTestNoModel {
	items = [{content: "one", id: 0, selected: false}, {content: "two", id: 1, selected: false}];
	itemValueKey = undefined;
	allowNullValues = false;
	disabled = false;
	dropUp = false;
	onSelect() {}
}

/** The web component trigger, its menu items and the selected label. */
const trigger = (element: Element) => shadow<HTMLElement>(element, ".cds--list-box__field");
const items = (element: Element): any[] => Array.from(element.querySelectorAll("cds-dropdown-item"));
const label = (element: Element) => shadow(element, ".cds--list-box__label").textContent.trim();
const expanded = (element: Element) => shadow(element, ".cds--list-box").classList.contains("cds--list-box--expanded");

describe("Dropdown", () => {
	let fixture, element, wrapper, dropdown: Dropdown;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				DropdownTest,
				DropdownTestNoModel
			]
		});
	});

	const create = async (type: any, changes: Record<string, any> = {}) => {
		fixture = TestBed.createComponent(type);
		wrapper = fixture.componentInstance;
		Object.assign(wrapper, changes);
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-dropdown");
		dropdown = fixture.debugElement.query(By.css("cds-dropdown")).componentInstance;
	};

	it("should work", async () => {
		await create(DropdownTest);
		expect(dropdown instanceof Dropdown).toBe(true);
		expect(element instanceof customElements.get("cds-dropdown")).toBe(true);
	});

	it("should expand the dropdown on click", async () => {
		await create(DropdownTest);
		trigger(element).click();
		await settle(fixture);
		expect(trigger(element).getAttribute("aria-expanded")).toEqual("true");
		expect(dropdown.isOpen).toBe(true);
	});

	["input", "form control"].forEach(disabledSource => {
		it(`should close an open dropdown when disabled through its ${disabledSource}`, async () => {
			await create(DropdownTestNoModel);
			wrapper.items[0].selected = true;
			wrapper.items = [...wrapper.items];
			const onSelect = spyOn(wrapper, "onSelect");
			await settle(fixture);

			trigger(element).click();
			await settle(fixture);
			expect(trigger(element).getAttribute("aria-expanded")).toBe("true");

			if (disabledSource === "input") {
				wrapper.disabled = true;
			} else {
				dropdown.setDisabledState(true);
			}
			await settle(fixture);

			expect(expanded(element)).toBe(false);
			expect(dropdown.selectedItems[0].id).toBe(0);
			expect(onSelect).not.toHaveBeenCalled();
		});
	});

	it("should propagate the change in selected option back to the form and emit a selected event", async () => {
		await create(DropdownTest);
		spyOn(wrapper, "onSelect");
		fixture.componentRef.setInput("isOpen", true);
		await settle(fixture);
		items(element)[0].click();
		await settle(fixture);
		expect(label(element)).toEqual("one");
		expect(wrapper.onSelect).toHaveBeenCalled();
		expect(wrapper.model.content).toEqual("one");
		expect(wrapper.model.selected).toBe(true);
	});

	it("should set the placeholder text to test", async () => {
		await create(DropdownTest);
		expect(label(element)).toEqual("test");
	});

	it("should keep custom classes on the host el", async () => {
		await create(DropdownTest);
		expect(element.classList.contains("custom-class")).toBe(true);
	});

	it("should ignore selected property from the items when using a form control", async () => {
		await create(DropdownTestNoModel, { itemValueKey: "id" });
		// without a form control, `selected` on the items is the selection
		wrapper.items = [{ content: "one", id: 0, selected: true }, { content: "two", id: 1, selected: false }];
		await settle(fixture);
		expect(dropdown.selectedItems.map(item => item.id)).toEqual([0]);

		// with a form control, the written value wins
		dropdown.registerOnChange(() => {});
		dropdown.writeValue(null);
		wrapper.items = [{ content: "one", id: 0, selected: true }, { content: "two", id: 1, selected: false }];
		await settle(fixture);
		expect(dropdown.selectedItems).toEqual([]);
	});

	it("should automatically reselect the written value when items are updated", async () => {
		await create(DropdownTestNoModel, { itemValueKey: "id" });
		dropdown.writeValue(0);
		await settle(fixture);
		expect(dropdown.selectedItems[0].id).toEqual(0);

		wrapper.items = [...wrapper.items, { id: 4, content: "four", selected: false }];
		await settle(fixture);

		expect(dropdown.selectedItems[0].id).toEqual(0);
		expect(items(element)[0].selected).toBe(true);
	});

	it("should update the written value if the user manually changes the selection", async () => {
		const onChange = jasmine.createSpy("onChange");
		await create(DropdownTestNoModel, { itemValueKey: "id" });
		dropdown.registerOnChange(onChange);
		dropdown.writeValue(1);
		await settle(fixture);

		trigger(element).click();
		await settle(fixture);
		items(element)[0].click();
		await settle(fixture);

		expect(onChange).toHaveBeenCalledWith(0);
		wrapper.items = [...wrapper.items];
		await settle(fixture);
		expect(dropdown.selectedItems[0].id).toEqual(0);
	});

	it("should allow null values when allowNullValues is true", async () => {
		const expectedContent = "null item";
		await create(DropdownTestNoModel, {
			itemValueKey: "id",
			allowNullValues: true,
			items: [{ content: "one", id: 0, selected: false }, { content: expectedContent, id: null, selected: false }]
		});
		dropdown.writeValue(null);
		await settle(fixture);
		expect(dropdown.selectedItems.map(item => item.content)).toEqual([expectedContent]);
		expect(label(element)).toEqual(expectedContent);
	});

	it("should not select a null value when allowNullValues is false", async () => {
		await create(DropdownTestNoModel, {
			itemValueKey: "id",
			items: [{ content: "one", id: 0, selected: false }, { content: "null item", id: null, selected: false }]
		});
		dropdown.writeValue(null);
		await settle(fixture);
		expect(dropdown.selectedItems).toEqual([]);
	});

	it("should collapse the list box when an item is picked", async () => {
		await create(DropdownTestNoModel);
		trigger(element).click();
		await settle(fixture);
		expect(expanded(element)).toBe(true);

		items(element)[0].click();
		await settle(fixture);

		expect(dropdown.isOpen).toBe(false);
		expect(expanded(element)).toBe(false);
		expect(trigger(element).getAttribute("aria-expanded")).toBe("false");
	});

	it("should open upwards when dropUp is set", async () => {
		await create(DropdownTestNoModel, { dropUp: true });
		expect(element.direction).toBe("top");
		wrapper.dropUp = false;
		await settle(fixture);
		expect(element.direction).toBe("bottom");
	});

	it("should collapse the list box when focus leaves it", async () => {
		await create(DropdownTestNoModel);
		trigger(element).click();
		await settle(fixture);
		expect(expanded(element)).toBe(true);

		element.dispatchEvent(new FocusEvent("focusout", { relatedTarget: document.body }));
		await settle(fixture);

		expect(dropdown.isOpen).toBe(false);
		expect(expanded(element)).toBe(false);
	});
});

@Component({
	template: `
		<cds-multi-select label="Pick" itemValueKey="id" [(ngModel)]="model" (selected)="onSelect($event)">
			<cds-dropdown-list [items]="items" />
		</cds-multi-select>`,
	imports: [MultiSelect, DropdownList, FormsModule]
})
class MultiSelectTest {
	model = [1];
	items = [{ content: "one", id: 0, selected: false }, { content: "two", id: 1, selected: false }];
	onSelect(_: ListItem[]) {}
}

describe("MultiSelect", () => {
	let fixture;
	let element;

	beforeEach(async () => {
		fixture = TestBed.createComponent(MultiSelectTest);
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-multi-select");
	});

	it("should show the number of selected items", async () => {
		expect(shadow(element, "#selection-button .cds--tag__label").textContent.trim()).toBe("1");
	});

	it("should add to the ngModel array and emit the selected items", async () => {
		spyOn(fixture.componentInstance, "onSelect");
		Array.from<any>(element.querySelectorAll("cds-multi-select-item")).find(item => item.value === "0").click();
		await settle(fixture);
		expect(fixture.componentInstance.model).toEqual([0, 1]);
		expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith([
			jasmine.objectContaining({ id: 0 }),
			jasmine.objectContaining({ id: 1 })
		]);
		expect(shadow(element, "#selection-button .cds--tag__label").textContent.trim()).toBe("2");
	});
});

@Component({
	template: `
		<cds-dropdown label="Reactive" itemValueKey="id" [formControl]="control">
			<cds-dropdown-list [items]="items" />
		</cds-dropdown>`,
	imports: [Dropdown, DropdownList, ReactiveFormsModule]
})
class ReactiveDropdownTest {
	control = new FormControl(1);
	items = [{ content: "one", id: 0, selected: false }, { content: "two", id: 1, selected: false }];
}

describe("Dropdown with reactive forms", () => {
	let fixture;
	let element;

	beforeEach(async () => {
		fixture = TestBed.createComponent(ReactiveDropdownTest);
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-dropdown");
	});

	it("should show the item matching the form value", () => {
		expect(label(element)).toBe("two");
	});

	it("should update the form value when an item is picked", async () => {
		trigger(element).click();
		await settle(fixture);
		items(element)[0].click();
		await settle(fixture);
		expect(fixture.componentInstance.control.value).toBe(0);
	});

	it("should keep the selection when the items are replaced", async () => {
		fixture.componentInstance.items = [
			{ content: "zero", id: -1, selected: false },
			{ content: "one", id: 0, selected: false },
			{ content: "two", id: 1, selected: false }
		];
		await settle(fixture);
		expect(label(element)).toBe("two");
	});

	it("should disable the dropdown with the form control", async () => {
		fixture.componentInstance.control.disable();
		await settle(fixture);
		expect(element.disabled).toBe(true);
		expect(shadow(element, ".cds--list-box").classList).toContain("cds--list-box--disabled");
	});
});
