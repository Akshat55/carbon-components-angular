import { Component, Input } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { settle } from "../test-helpers/web-components";
import { ContextMenuComponent } from "./context-menu.component";
import { ContextMenuItemComponent } from "./context-menu-item.component";
import { ContextMenuDividerComponent } from "./context-menu-divider.component";
import { ContextMenuGroupComponent } from "./context-menu-group.component";
import { MenuItemRadioGroup, MenuItemSelectable } from "./menu-item-selectable.component";
import { ItemClickEvent } from "./context-menu.types";
import { MenuButtonComponent } from "../menu-button/menu-button.component";

@Component({
	template: `
		<cds-menu [open]="open">
			<cds-menu-item label="Option with icon" icon="calendar" value="icon" (itemClick)="onItemClick($event)" />
			<cds-menu-item-divider />
			<cds-menu-item-group label="Selection group">
				<cds-menu-item-selectable label="Blue" [(selected)]="blue" />
				<cds-menu-item-selectable label="Red" [selected]="true" />
			</cds-menu-item-group>
			<cds-menu-item-divider />
			<cds-menu-item label="Radio flyout">
				<cds-menu slot="submenu">
					<cds-menu-item-radio-group label="Radios" [(selected)]="radio">
						<cds-menu-item label="Radio one" />
						<cds-menu-item label="Radio two" />
					</cds-menu-item-radio-group>
				</cds-menu>
			</cds-menu-item>
		</cds-menu>
	`,
	imports: [
		ContextMenuComponent,
		ContextMenuItemComponent,
		ContextMenuDividerComponent,
		ContextMenuGroupComponent,
		MenuItemSelectable,
		MenuItemRadioGroup
	]
})
class MenuTestComponent {
	@Input() open = true;
	radio = "Radio one";
	blue = false;

	onItemClick(_: ItemClickEvent) {}
}

describe("Menu", () => {
	let fixture, wrapper;
	const element = (selector: string) => fixture.nativeElement.querySelector(selector);

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [MenuTestComponent]
		});
		fixture = TestBed.createComponent(MenuTestComponent);
		wrapper = fixture.componentInstance;
		await settle(fixture);
	});

	it("should work", () => {
		const menu = element("cds-menu");
		expect(wrapper instanceof MenuTestComponent).toBe(true);
		expect(menu instanceof customElements.get("cds-menu")).toBe(true);
		expect(menu.open).toBe(true);
	});

	it("should close the menu when open is set to false", async () => {
		const menu = element("cds-menu");
		wrapper.open = false;
		await settle(fixture);
		expect(menu.open).toBe(false);
	});

	it("should emit itemClick with the item's details", async () => {
		spyOn(wrapper, "onItemClick");
		element("cds-menu-item[label='Option with icon']").click();
		await settle(fixture);
		expect(wrapper.onItemClick).toHaveBeenCalledWith(jasmine.objectContaining({ label: "Option with icon", value: "icon" }));
	});

	it("should pass selected to selectable items and update [(selected)] on click", async () => {
		expect(element("cds-menu-item-selectable[label='Red']").selected).toBe(true);
		element("cds-menu-item-selectable[label='Blue']").shadowRoot.querySelector("cds-menu-item").click();
		await settle(fixture);
		expect(wrapper.blue).toBe(true);
	});

	it("should update the radio group's [(selected)] on click", async () => {
		const [, two] = fixture.nativeElement.querySelectorAll("cds-menu-item-radio-group cds-menu-item");
		two.click();
		await settle(fixture);
		expect(wrapper.radio).toBe("Radio two");
	});

	it("should render the divider web component", () => {
		const divider = element("cds-menu-item-divider");
		expect(divider instanceof customElements.get("cds-menu-item-divider")).toBe(true);
	});
});

@Component({
	template: `
		<cds-menu-button label="Actions" size="sm">
			<cds-menu>
				<cds-menu-item label="Plain" />
				<cds-menu-item label="Delete" [danger]="true" />
			</cds-menu>
		</cds-menu-button>
	`,
	imports: [MenuButtonComponent, ContextMenuComponent, ContextMenuItemComponent]
})
class MenuDefaultsTest {}

describe("Context menu defaults", () => {
	it("should keep the web components' defaults and take the menu button's size", async () => {
		const fixture = TestBed.createComponent(MenuDefaultsTest);
		await settle(fixture);
		const menu = fixture.nativeElement.querySelector("cds-menu");
		const [plain, danger] = fixture.nativeElement.querySelectorAll("cds-menu-item");
		expect(menu.getAttribute("size")).toBe("sm");
		expect(menu.open).toBe(false);
		expect(plain.kind).toBe("default");
		expect(plain.disabled).toBeFalsy();
		expect(danger.kind).toBe("danger");
	});
});
