import { Component, TemplateRef, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { settle, shadow } from "../test-helpers/web-components";
import { OverflowMenuModule } from "./overflow-menu.module";
import { OverflowMenu } from "./overflow-menu.component";
import { OverflowMenuOption } from "./overflow-menu-option.component";

@Component({
	template: `
		<cds-overflow-menu
			[open]="open"
			[flip]="flip"
			[buttonLabel]="buttonLabel"
			[customTrigger]="useCustomTrigger ? customTrigger : null"
			(openChange)="onOpenChange($event)">
			<cds-overflow-menu-body [flipped]="flip">
				<cds-overflow-menu-item (selected)="onSelected()">Option one</cds-overflow-menu-item>
				<cds-overflow-menu-item [disabled]="secondDisabled">Option two</cds-overflow-menu-item>
				<cds-overflow-menu-item href="https://carbondesignsystem.com/">Option three</cds-overflow-menu-item>
				<cds-overflow-menu-item type="danger">Delete</cds-overflow-menu-item>
			</cds-overflow-menu-body>
		</cds-overflow-menu>
		<ng-template #customTrigger><span class="custom-trigger">Custom</span></ng-template>
	`,
	imports: [OverflowMenuModule]
})
class OverflowMenuTest {
	@ViewChild(OverflowMenu) overflowMenu: OverflowMenu;
	@ViewChild("customTrigger", { static: true }) customTrigger: TemplateRef<any>;

	open = false;
	flip = false;
	buttonLabel = "Menu options";
	useCustomTrigger = false;
	secondDisabled = false;
	openState = null;

	onOpenChange(event) {
		this.open = event;
		this.openState = event;
	}
	onSelected() {}
}

describe("OverflowMenu", () => {
	let fixture: ComponentFixture<OverflowMenuTest>;
	let wrapper: OverflowMenuTest;
	let element: any;

	const trigger = () => shadow<HTMLButtonElement>(element, "button");
	const body = (): any => document.querySelector("cds-overflow-menu-body");
	const items = (): any[] => Array.from(document.querySelectorAll("cds-overflow-menu-item"));

	async function openMenu() {
		wrapper.open = true;
		await settle(fixture);
	}

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [OverflowMenuTest]
		});

		fixture = TestBed.createComponent(OverflowMenuTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-overflow-menu");
	});

	afterEach(() => fixture.destroy());

	it("should work", () => {
		expect(wrapper.overflowMenu instanceof OverflowMenu).toBe(true);
		expect(element instanceof customElements.get("cds-overflow-menu")).toBe(true);
	});

	it("should render the trigger button with its aria label", () => {
		expect(trigger()).toBeTruthy();
		expect(trigger().getAttribute("aria-label")).toBe("Menu options");
		expect(trigger().getAttribute("aria-haspopup")).toBe("menu");
		expect(trigger().getAttribute("aria-expanded")).toBe("false");
	});

	it("should render the overflow icon in the trigger's icon slot", () => {
		const icon = element.querySelector(":scope > svg[slot=icon]");
		expect(icon).toBeTruthy();
		expect(icon.classList.contains("cds--overflow-menu__icon")).toBe(true);
		expect(icon.childElementCount).toBeGreaterThan(0);
	});

	it("should render a custom trigger in place of the icon", async () => {
		wrapper.useCustomTrigger = true;
		await settle(fixture);

		expect(element.querySelector(":scope > [slot=icon] .custom-trigger")).toBeTruthy();
		expect(element.querySelector(":scope > svg[slot=icon]")).toBeNull();
	});

	it("should open the menu when open is set", async () => {
		expect(body().open).toBe(false);

		await openMenu();

		expect(element.open).toBe(true);
		expect(body().open).toBe(true);
		expect(trigger().getAttribute("aria-expanded")).toBe("true");
	});

	it("should open the menu when the trigger is clicked and emit openChange", async () => {
		trigger().click();
		await settle(fixture);

		expect(wrapper.openState).toBe(true);
		expect(wrapper.overflowMenu.open).toBe(true);
		expect(body().open).toBe(true);
	});

	it("should render an item per projected option", async () => {
		await openMenu();

		expect(items().length).toBe(4);
		expect(items()[0].textContent).toContain("Option one");
		expect(fixture.debugElement.queryAll(By.directive(OverflowMenuOption)).length).toBe(4);
	});

	it("should render an anchor for an option with an href", async () => {
		await openMenu();

		expect(shadow(items()[2], "a").getAttribute("href")).toBe("https://carbondesignsystem.com/");
	});

	it("should render a danger option", async () => {
		await openMenu();

		expect(items()[3].danger).toBe(true);
	});

	it("should disable an option when it is marked disabled", async () => {
		wrapper.secondDisabled = true;
		await openMenu();

		expect(items()[1].disabled).toBe(true);
		expect(shadow<HTMLButtonElement>(items()[1], "button").disabled).toBe(true);
	});

	it("should emit selected and close when an option is clicked", async () => {
		spyOn(wrapper, "onSelected");
		await openMenu();

		shadow<HTMLButtonElement>(items()[0], "button").click();
		await settle(fixture);

		expect(wrapper.onSelected).toHaveBeenCalled();
		expect(wrapper.openState).toBe(false);
		expect(wrapper.overflowMenu.open).toBe(false);
	});

	it("should not emit selected for a disabled option", async () => {
		spyOn(wrapper, "onSelected");
		wrapper.secondDisabled = true;
		await openMenu();

		items()[1].click();
		await settle(fixture);

		expect(wrapper.onSelected).not.toHaveBeenCalled();
	});

	it("should emit openChange when the menu closes", async () => {
		await openMenu();

		element.open = false;
		await settle(fixture);

		expect(wrapper.openState).toBe(false);
		expect(wrapper.overflowMenu.open).toBe(false);
	});

	it("should flip the menu", async () => {
		wrapper.flip = true;
		await openMenu();

		expect(element.flipped).toBe(true);
		expect(body().flipped).toBe(true);
	});

	it("should remove the menu body moved to the document when destroyed", async () => {
		await openMenu();
		expect(body().parentElement).toBe(document.body);

		fixture.destroy();

		expect(document.querySelector("cds-overflow-menu-body")).toBeNull();
	});
});

@Component({
	template: `
		<cds-overflow-menu>
			<cds-overflow-menu-body [direction]="direction">
				<cds-overflow-menu-item>One</cds-overflow-menu-item>
				<cds-overflow-menu-item type="danger">Delete</cds-overflow-menu-item>
			</cds-overflow-menu-body>
		</cds-overflow-menu>
	`,
	imports: [OverflowMenuModule]
})
class OverflowMenuPlacementTest {
	direction: "top" | "bottom" | undefined;
}

describe("OverflowMenu direction and defaults", () => {
	it("should keep the web components' defaults when inputs are unset", async () => {
		const fixture = TestBed.createComponent(OverflowMenuPlacementTest);
		await settle(fixture);
		const menu = fixture.nativeElement.querySelector("cds-overflow-menu");
		const body = fixture.nativeElement.querySelector("cds-overflow-menu-body");
		const [plain, danger] = fixture.nativeElement.querySelectorAll("cds-overflow-menu-item");
		expect(menu.open).toBe(false);
		expect(menu.flipped).toBe(false);
		expect(body.direction).toBe("bottom");
		expect(plain.danger).toBe(false);
		expect(plain.disabled).toBe(false);
		expect(danger.danger).toBe(true);
	});

	it("should pass direction to the menu body", async () => {
		const fixture = TestBed.createComponent(OverflowMenuPlacementTest);
		fixture.componentInstance.direction = "top";
		await settle(fixture);
		expect(fixture.nativeElement.querySelector("cds-overflow-menu-body").direction).toBe("top");
	});
});
