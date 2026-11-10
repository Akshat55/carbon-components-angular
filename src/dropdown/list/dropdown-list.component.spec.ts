import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { settle, shadow } from "../../test-helpers/web-components";
import { Dropdown, MultiSelect } from "../dropdown.component";
import { ListItem } from "../list-item.interface";
import { DropdownList } from "./dropdown-list.component";

/*
 * In v7 `cds-dropdown-list` renders nothing itself: it gives its items (and `listTpl`) to the
 * parent `cds-dropdown` / `cds-multi-select`, which renders them as web component items.
 * These are the v6 list tests, run through a parent.
 */

@Component({
	template: `
		<cds-dropdown label="List">
			<cds-dropdown-list [items]="items" (select)="onSelect($event)" />
		</cds-dropdown>`,
	imports: [Dropdown, DropdownList]
})
class DropdownListTest {
	items = [
		({content: "one", selected: false} as ListItem),
		({content: "two", selected: false} as ListItem)
	];
	selected: ListItem;
	onSelect(ev) {
		this.selected = ev.item;
	}
}

@Component({
	template: `
		<cds-multi-select label="List" [selectionFeedback]="selectionFeedback">
			<cds-dropdown-list [items]="items" (select)="onSelect($event)" type="multi" />
		</cds-multi-select>`,
	imports: [MultiSelect, DropdownList]
})
class MultiTest {
	items = [
		({content: "one", selected: false} as ListItem),
		({content: "two", selected: false} as ListItem)
	];
	selectionFeedback = "fixed";
	selected: ListItem[];
	onSelect(ev) {
		this.selected = ev;
	}
}

const rendered = (fixture: ComponentFixture<any>, tag: string): any[] => Array.from(fixture.nativeElement.querySelectorAll(tag));

describe("Dropdown list", () => {
	let fixture: ComponentFixture<DropdownListTest>, wrapper: DropdownListTest, dropdown: any;
	const items = () => rendered(fixture, "cds-dropdown-item");

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				DropdownListTest
			]
		});
	});

	beforeEach(async () => {
		fixture = TestBed.createComponent(DropdownListTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		dropdown = fixture.nativeElement.querySelector("cds-dropdown");
	});

	it("should work", () => {
		// The list is not rendered, so reach it through its parent.
		const list = fixture.debugElement.query(By.directive(Dropdown)).componentInstance.list;
		expect(list instanceof DropdownList).toBe(true);
		expect(list.getListItems().length).toBe(2);
	});

	it("should select an item", async () => {
		items()[0].click();
		await settle(fixture);
		expect(wrapper.selected.content).toBe("one");
	});

	it("should disable a list-item", async () => {
		wrapper.items = [
			({content: "one", selected: false} as ListItem),
			({content: "two", selected: false, disabled: false} as ListItem),
			({content: "three", selected: false, disabled: true} as ListItem)
		];
		await settle(fixture);
		expect(items().filter(item => item.disabled).length).toEqual(1);
		expect(items().filter(item => !item.disabled).length).toEqual(2);
	});

	it("should re-render the list when the items change", async () => {
		expect(items().length).toBe(2);

		wrapper.items = [
			({ content: "one", selected: false } as ListItem),
			({ content: "two", selected: false } as ListItem),
			({ content: "three", selected: false } as ListItem)
		];
		await settle(fixture);

		expect(items().length).toBe(3);
		expect(items()[2].textContent.trim()).toBe("three");
	});

	it("should mark an item active when it is passed as selected", async () => {
		wrapper.items = [
			({ content: "one", selected: true } as ListItem),
			({ content: "two", selected: false } as ListItem)
		];
		await settle(fixture);

		expect(items()[0].selected).toBe(true);
		expect(shadow(items()[0], ".cds--list-box__menu-item__selected-icon")).toBeTruthy();
		expect(shadow(dropdown, ".cds--list-box__label").textContent.trim()).toBe("one");
	});

	it("should highlight the selected item when the list is opened", async () => {
		wrapper.items = [
			({ content: "one", selected: false } as ListItem),
			({ content: "two", selected: true } as ListItem)
		];
		await settle(fixture);

		shadow(dropdown, ".cds--list-box__field").click();
		await settle(fixture);

		expect(items()[1].highlighted).toBe(true);
		expect(items()[0].highlighted).toBe(false);
	});
});

describe("Dropdown multi list", () => {
	let fixture: ComponentFixture<MultiTest>, wrapper: MultiTest;
	const items = () => rendered(fixture, "cds-multi-select-item");

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				MultiTest
			]
		});
	});

	beforeEach(async () => {
		fixture = TestBed.createComponent(MultiTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
	});

	it("should work", () => {
		const list = fixture.debugElement.query(By.directive(MultiSelect)).componentInstance.list;
		expect(list instanceof DropdownList).toBe(true);
	});

	it("should multi select", async () => {
		items()[0].click();
		await settle(fixture);
		items()[1].click();
		await settle(fixture);
		expect(wrapper.selected.length).toBe(2);
		expect(wrapper.selected[0].content).toBe("one");
		expect(wrapper.selected[1].content).toBe("two");
	});

	it("should disable a list-item and its checkbox", async () => {
		wrapper.items = [
			({content: "one", selected: false} as ListItem),
			({content: "two", selected: false, disabled: false} as ListItem),
			({content: "three", selected: false, disabled: true} as ListItem)
		];
		await settle(fixture);
		const disabled = items().filter(item => item.disabled);
		expect(disabled.length).toEqual(1);
		expect(shadow<HTMLInputElement>(disabled[0], "input[type=checkbox]")?.disabled ?? disabled[0].disabled).toBe(true);
		expect(items().filter(item => !item.disabled).length).toEqual(2);
	});

	it("should keep the item order when selectionFeedback is fixed", async () => {
		wrapper.items = [
			({ content: "one", selected: false } as ListItem),
			({ content: "two", selected: true } as ListItem)
		];
		await settle(fixture);
		expect(items().map(item => item.textContent.trim())).toEqual(["one", "two"]);
	});

	it("should move the selected items to the top when the menu reopens (top-after-reopen)", async () => {
		wrapper.selectionFeedback = "top-after-reopen";
		await settle(fixture);
		items()[1].click();
		await settle(fixture);
		expect(items()[0].textContent.trim()).toBe("one");

		const multiSelect = fixture.nativeElement.querySelector("cds-multi-select");
		shadow(multiSelect, ".cds--list-box__field").click();
		await settle(fixture);
		expect(items()[0].textContent.trim()).toBe("two");
	});

	it("should move the selected items to the top when selectionFeedback is top", async () => {
		wrapper.selectionFeedback = "top";
		wrapper.items = [
			({ content: "one", selected: false } as ListItem),
			({ content: "two", selected: true } as ListItem)
		];
		await settle(fixture);

		expect(items()[0].textContent.trim()).toBe("two");
	});
});
