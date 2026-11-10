import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { settle, shadow } from "../test-helpers/web-components";
import { ContextMenuDividerComponent, ContextMenuItemComponent } from "../context-menu";
import { MenuButtonComponent } from "../menu-button";

@Component({
	template: `
		<cds-menu-button label="Menu button" [open]="open">
			<cds-menu-item label="First action with a long label description" />
			<cds-menu-item label="Second action" />
			<cds-menu-item label="Third action" [disabled]="true" />
			<cds-menu-divider />
			<cds-menu-item label="Cut" info="⌘X" />
			<cds-menu-item label="Option with icon" icon="calendar" />
			<cds-menu-divider />
			<cds-menu-item label="Danger action" kind="danger" />
		</cds-menu-button>
	`,
	imports: [
		MenuButtonComponent,
		ContextMenuItemComponent,
		ContextMenuDividerComponent
	]
})
class MenuButtonTestComponent {
	open = false;
}

describe("Menu button", () => {
	let fixture, wrapper, menuButton: MenuButtonComponent, element, menu;
	const trigger = () => shadow<HTMLElement>(element, "cds-button");

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [MenuButtonTestComponent]
		});
		fixture = TestBed.createComponent(MenuButtonTestComponent);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		menuButton = fixture.debugElement.query(By.directive(MenuButtonComponent)).componentInstance;
		element = fixture.nativeElement.querySelector("cds-menu-button");
		menu = element.querySelector("cds-menu");
	});

	it("should work", () => {
		expect(menuButton instanceof MenuButtonComponent).toBe(true);
		expect(element instanceof customElements.get("cds-menu-button")).toBe(true);
		expect(trigger().textContent).toContain("Menu button");
		expect(menu.querySelectorAll("cds-menu-item").length).toBe(6);
	});

	it("should open the menu on button click", async () => {
		trigger().click();
		await settle(fixture);
		expect(menuButton.open).toBeTrue();
		expect(menu.open).toBeTrue();
	});

	it("should open & close the menu on button click", async () => {
		trigger().click();
		await settle(fixture);
		expect(menuButton.open).toBeTrue();

		trigger().click();
		await settle(fixture);
		expect(menuButton.open).toBeFalse();
		expect(menu.open).toBeFalse();
	});

	it("should open the menu when the host sets open", async () => {
		wrapper.open = true;
		await settle(fixture);
		expect(menu.open).toBeTrue();
	});

	it("should close on menu item click", async () => {
		trigger().click();
		await settle(fixture);
		expect(menu.open).toBeTrue();

		menu.querySelector("cds-menu-item[label='Second action']").click();
		await settle(fixture);

		expect(menu.open).toBeFalse();
		expect(menuButton.open).toBeFalse();
	});
});
