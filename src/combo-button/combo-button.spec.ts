import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { settle, shadow } from "../test-helpers/web-components";
import { ComboButtonComponent } from "./combo-button.component";
import { ContextMenuDividerComponent, ContextMenuItemComponent } from "../context-menu";

@Component({
	template: `
		<cds-combo-button label="Primary action" [open]="open" (actionClick)="onAction()">
			<cds-menu-item label="First action with a long label description" />
			<cds-menu-item label="Second action" />
			<cds-menu-item label="Third action" [disabled]="true" />
			<cds-menu-item-divider />
			<cds-menu-item label="Cut" info="⌘X" />
			<cds-menu-item label="Option with icon" icon="calendar" />
			<cds-menu-item-divider />
			<cds-menu-item label="Danger action" kind="danger" />
		</cds-combo-button>
	`,
	imports: [
		ComboButtonComponent,
		ContextMenuItemComponent,
		ContextMenuDividerComponent
	]
})
class ComboButtonTestComponent {
	open = false;
	onAction = jasmine.createSpy("onAction");
}

describe("Combo button", () => {
	let fixture, wrapper, comboButton: ComboButtonComponent, element, menu;
	const iconButton = () => shadow<HTMLElement>(element, "cds-icon-button");

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [ComboButtonTestComponent]
		});
		fixture = TestBed.createComponent(ComboButtonTestComponent);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		comboButton = fixture.debugElement.query(By.directive(ComboButtonComponent)).componentInstance;
		element = fixture.nativeElement.querySelector("cds-combo-button");
		menu = element.querySelector("cds-menu");
	});

	it("should work", () => {
		expect(comboButton instanceof ComboButtonComponent).toBe(true);
		expect(element instanceof customElements.get("cds-combo-button")).toBe(true);
		expect(shadow(element, "cds-button").textContent).toContain("Primary action");
	});

	it("should emit actionClick when the primary action is clicked", async () => {
		shadow<HTMLElement>(element, "cds-button").click();
		await settle(fixture);
		expect(wrapper.onAction).toHaveBeenCalled();
		expect(comboButton.open).toBeFalse();
	});

	it("should open & close the menu on icon button click", async () => {
		iconButton().click();
		await settle(fixture);
		expect(comboButton.open).toBeTrue();
		expect(menu.open).toBeTrue();

		iconButton().click();
		await settle(fixture);
		expect(comboButton.open).toBeFalse();
		expect(menu.open).toBeFalse();
	});

	it("should open the menu when the host sets open", async () => {
		wrapper.open = true;
		await settle(fixture);
		expect(menu.open).toBeTrue();
	});

	it("should close on menu item click", async () => {
		iconButton().click();
		await settle(fixture);
		expect(menu.open).toBeTrue();

		menu.querySelector("cds-menu-item[label='Second action']").click();
		await settle(fixture);

		expect(menu.open).toBeFalse();
		expect(comboButton.open).toBeFalse();
	});
});
