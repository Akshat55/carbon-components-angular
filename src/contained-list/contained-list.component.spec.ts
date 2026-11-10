import { Component, Input, inject } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import Apple16 from "@carbon/icons/es/apple/16";
import Fish16 from "@carbon/icons/es/fish/16";

import { settle, shadow } from "../test-helpers/web-components";
import { IconButton } from "../button";
import { IconDirective, IconService } from "../icon";
import { ContainedListItem } from "./contained-list-item.component";
import { ContainedList } from "./contained-list.component";
import { ContainedListKind, ContainedListSize } from "./contained-list.enums";

@Component({
	template: `
		<cds-contained-list
			[label]="label"
			[isInset]="isInset"
			[size]="size"
			[kind]="kind">
			<cds-contained-list-item>List item</cds-contained-list-item>
		</cds-contained-list>
	`,
	imports: [ContainedList, ContainedListItem]
})
class InputsComponent {
	@Input() label: string;
	@Input() isInset = false;
	@Input() size = ContainedListSize.Large;
	@Input() kind = ContainedListKind.OnPage;
}

@Component({
	template: `
		<ng-template #label>
			<h1>My contained list</h1>
		</ng-template>

		<ng-template #action>
			<cds-icon-button
				type="button"
				kind="primary"
				align="left"
				description="Add">
				<svg cdsIcon="add" size="16"></svg>
			</cds-icon-button>
		</ng-template>

		<ng-template #icon>
			<svg cdsIcon="fish" size="16"></svg>
		</ng-template>

		<cds-contained-list [label]="label" [action]="action">
			<cds-contained-list-item>List item</cds-contained-list-item>
			<cds-contained-list-item [icon]="icon">List item with icon</cds-contained-list-item>
			<cds-contained-list-item icon="apple">List item with string ref icon</cds-contained-list-item>
			<cds-contained-list-item [action]="action">List item with action</cds-contained-list-item>
			<cds-contained-list-item [clickable]="true" (cds-contained-list-item-click)="clicked()">
				Clickable list item
			</cds-contained-list-item>
		</cds-contained-list>
	`,
	imports: [
		ContainedList,
		ContainedListItem,
		IconDirective,
		IconButton
	]
})
class WrapperComponent {
	clicked = jasmine.createSpy("clicked");

	constructor() {
		inject(IconService).registerAll([Apple16, Fish16]);
	}
}

describe("ContainedList", () => {
	let fixture: ComponentFixture<InputsComponent>;
	let list: ContainedList;
	let element: any;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [InputsComponent, WrapperComponent]
		});

		fixture = TestBed.createComponent(InputsComponent);
		await settle(fixture);
		list = fixture.debugElement.query(By.directive(ContainedList)).componentInstance;
		element = fixture.nativeElement.querySelector("cds-contained-list");
	});

	it("should set default inputs", () => {
		expect(list.action).toBeUndefined();
		expect(list.isInset).toBeFalsy();
		expect(list.kind).toBe(ContainedListKind.OnPage);
		expect(list.label).toBeUndefined();
		expect(list.size).toBe(ContainedListSize.Large);
		expect(element instanceof customElements.get("cds-contained-list")).toBe(true);
	});

	it("should display the label when a string is provided", async () => {
		fixture.componentInstance.label = "My contained list";
		await settle(fixture);

		expect(shadow(element, ".cds--contained-list__label").textContent.trim()).toEqual("My contained list");
	});

	it("should have the correct isInset class", async () => {
		fixture.componentInstance.isInset = true;
		await settle(fixture);

		expect(shadow(element, ".cds--contained-list").classList).toContain("cds--contained-list--inset-rulers");
	});

	it("should have the correct size class", async () => {
		fixture.componentInstance.size = ContainedListSize.Small;
		await settle(fixture);

		expect(shadow(element, ".cds--contained-list").classList).toContain("cds--layout--size-sm");
	});

	it("should have the correct kind class", async () => {
		fixture.componentInstance.kind = ContainedListKind.Disclosed;
		await settle(fixture);

		expect(shadow(element, ".cds--contained-list").classList).toContain("cds--contained-list--disclosed");
	});

	describe("TemplateRefs", () => {
		let wrapperFixture: ComponentFixture<WrapperComponent>;
		let wrapperElement: any;

		beforeEach(async () => {
			wrapperFixture = TestBed.createComponent(WrapperComponent);
			await settle(wrapperFixture);
			wrapperElement = wrapperFixture.nativeElement.querySelector("cds-contained-list");
		});

		it("should render the label if it is a TemplateRef", () => {
			expect(wrapperElement.querySelector(":scope > h1[slot=label]").textContent.trim()).toBe("My contained list");
			expect(shadow<HTMLSlotElement>(wrapperElement, "slot[name=label]")).toBeTruthy();
		});

		it("should render the action if it is a TemplateRef", () => {
			expect(wrapperElement.querySelector(":scope > cds-icon-button[slot=action]")).toBeTruthy();
		});
	});

	describe("ContainedListItem", () => {
		let wrapperFixture: ComponentFixture<WrapperComponent>;
		const items = (): any[] => Array.from(wrapperFixture.nativeElement.querySelectorAll("cds-contained-list-item"));

		beforeEach(async () => {
			wrapperFixture = TestBed.createComponent(WrapperComponent);
			await settle(wrapperFixture);
		});

		it("should render the content", () => {
			expect(items()[0] instanceof customElements.get("cds-contained-list-item")).toBe(true);
			expect(items()[0].textContent.trim()).toBe("List item");
		});

		it("should render the icon from template ref", () => {
			expect(items()[1].querySelector("svg[slot=icon][cdsIcon='fish']")).toBeTruthy();
			expect(shadow(items()[1], ".cds--contained-list-item--with-icon")).toBeTruthy();
		});

		it("should render the icon from string ref", () => {
			expect(items()[2].querySelector("svg[slot=icon]")).toBeTruthy();
		});

		it("should render the action", () => {
			expect(items()[3].querySelector("cds-icon-button[slot=action]")).toBeTruthy();
			expect(shadow(items()[3], ".cds--contained-list-item--with-action")).toBeTruthy();
		});

		it("should render with the clickable state", async () => {
			expect(shadow(items()[4], ".cds--contained-list-item--clickable")).toBeTruthy();
			const button = shadow<HTMLButtonElement>(items()[4], "button");
			expect(button.textContent.trim()).toBe("");
			expect(items()[4].textContent.trim()).toBe("Clickable list item");

			button.click();
			await settle(wrapperFixture);
			expect(wrapperFixture.componentInstance.clicked).toHaveBeenCalled();
		});
	});
});
