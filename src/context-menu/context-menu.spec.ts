import { Component, Input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { settle } from "../test-helpers/web-components";
import { ContextMenuComponent } from "./context-menu.component";
import { ContextMenuItemComponent } from "./context-menu-item.component";
import { ContextMenuDividerComponent } from "./context-menu-divider.component";
import { ContextMenuGroupComponent } from "./context-menu-group.component";
import { ContextMenuSelectionService } from "./context-menu-selection.service";

@Component({
	template: `
		<cds-menu [open]="open">
			<cds-menu-item label="Option with icon" icon="calendar" />
			<cds-menu-item-divider />
			<cds-menu-item type="checkbox" label="Enable magic" />
			<cds-menu-item-divider />
			<cds-menu-item-group
				type="checkbox"
				label="Selection group"
				[value]="checkboxGroupValue">
				<cds-menu-item type="checkbox" label="Blue" value="blue"></cds-menu-item>
				<cds-menu-item type="checkbox" label="Red" value="red" [checked]="true"></cds-menu-item>
			</cds-menu-item-group>
			<cds-menu-item-divider />
			<cds-menu-item label="Radio flyout">
				<cds-menu>
					<cds-menu-item-group
						type="radio"
						[value]="radioGroupValue"
						(valueChange)="onRadioChange($event)">
						<cds-menu-item type="radio" label="Radio one" value="one" />
						<cds-menu-item type="radio" label="Radio two" value="two" />
					</cds-menu-item-group>
				</cds-menu>
			</cds-menu-item>
		</cds-menu>
	`,
	imports: [
		ContextMenuComponent,
		ContextMenuItemComponent,
		ContextMenuDividerComponent,
		ContextMenuGroupComponent
	]
})
class MenuTestComponent {
	@Input() open = true;
	radioGroupValue = "one";
	checkboxGroupValue = ["red"];

	onRadioChange(event) {}
}

describe("Menu", () => {
	let fixture, wrapper;
	const item = (selector: string) => fixture.debugElement.query(By.css(`cds-menu-item${selector}`));
	const hasCheckmark = (debugElement) => !!debugElement.nativeElement.querySelector("svg[slot=render-icon]");

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [MenuTestComponent]
		});
		fixture = TestBed.createComponent(MenuTestComponent);
		wrapper = fixture.componentInstance;
		await settle(fixture);
	});

	it("should work", () => {
		const menu = fixture.nativeElement.querySelector("cds-menu");
		expect(wrapper instanceof MenuTestComponent).toBe(true);
		expect(menu instanceof customElements.get("cds-menu")).toBe(true);
		expect(menu.open).toBe(true);
	});

	it("should close the menu when open is set to false", async () => {
		const menu = fixture.nativeElement.querySelector("cds-menu");
		wrapper.open = false;
		await settle(fixture);
		expect(menu.open).toBe(false);
	});

	it("should have red checkbox checked by default", () => {
		const red = item("[label='Red']");
		expect(red.componentInstance.checked).toBeTrue();
		expect(red.nativeElement.getAttribute("aria-checked")).toBe("true");
	});

	it("should have radio one selected by default", () => {
		expect(item("[type='radio'][value='one']").componentInstance.checked).toBeTrue();
	});

	it("should emit valueChange from group when a radio item is clicked", async () => {
		spyOn(wrapper, "onRadioChange");
		const radioOne = item("[type='radio'][value='one']");
		const radioTwo = item("[type='radio'][value='two']");

		radioTwo.nativeElement.click();
		await settle(fixture);

		expect(wrapper.onRadioChange).toHaveBeenCalledWith("two");
		expect(hasCheckmark(radioTwo)).toBeTrue();
		expect(hasCheckmark(radioOne)).toBeFalse();
	});

	it("should check the radio item the selection service selects", async () => {
		const group = fixture.debugElement.query(By.css("cds-menu-item-group[type='radio']"));
		group.injector.get(ContextMenuSelectionService).selectRadio("two");
		await settle(fixture);

		expect(hasCheckmark(item("[type='radio'][value='two']"))).toBeTrue();
		expect(hasCheckmark(item("[type='radio'][value='one']"))).toBeFalse();
	});

	it("should update aria-checked when a checkbox item is toggled", async () => {
		const blue = item("[label='Blue']");
		expect(blue.nativeElement.getAttribute("aria-checked")).toBe("false");

		blue.nativeElement.click();
		await settle(fixture);

		expect(blue.nativeElement.getAttribute("aria-checked")).toBe("true");
		expect(hasCheckmark(blue)).toBeTrue();
	});

	it("should check every checkbox item the selection service selects", async () => {
		const group = fixture.debugElement.query(By.css("cds-menu-item-group[type='checkbox']"));
		group.injector.get(ContextMenuSelectionService).selectCheckboxes(["blue", "red"]);
		await settle(fixture);

		const blue = item("[label='Blue']");
		const red = item("[label='Red']");
		expect(blue.nativeElement.getAttribute("aria-checked")).toBe("true");
		expect(red.nativeElement.getAttribute("aria-checked")).toBe("true");
		expect(hasCheckmark(blue)).toBeTrue();
		expect(hasCheckmark(red)).toBeTrue();
	});

	it("should render the divider web component", () => {
		const divider = fixture.nativeElement.querySelector("cds-menu-item-divider");
		expect(divider instanceof customElements.get("cds-menu-item-divider")).toBe(true);
	});

	it("should detect if there is a child context menu", () => {
		const flyout = item("[label='Radio flyout']");
		expect(flyout.componentInstance.childContextMenu).toBeTruthy();
		expect(flyout.nativeElement.querySelector(":scope > cds-menu").getAttribute("slot")).toBe("submenu");
	});
});
