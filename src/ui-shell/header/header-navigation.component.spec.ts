import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { settle, shadow } from "../../test-helpers/web-components";
import { UIShellModule } from "../ui-shell.module";
import { HeaderNavigation } from "./header-navigation.component";
import { HeaderMenu } from "./header-menu.component";
import { HeaderGlobal } from "./header-global.component";
import { HeaderAction } from "./header-action.component";

@Component({
	template: `
		<cds-header-nav [ariaLabel]="ariaLabel" [navigationItems]="navigationItems">
			<cds-header-nav-item [isCurrentPage]="isCurrentPage" href="#projected">Projected item</cds-header-nav-item>
			<cds-header-menu [title]="menuTitle" [trigger]="trigger">
				<cds-header-menu-item href="#child">Menu child</cds-header-menu-item>
			</cds-header-menu>
		</cds-header-nav>
		<cds-header-global>
			<cds-header-global-action [(active)]="actionActive" ariaLabel="Toggle panel"></cds-header-global-action>
		</cds-header-global>
	`,
	imports: [UIShellModule]
})
class HeaderNavigationTest {
	@ViewChild(HeaderNavigation) navigation: HeaderNavigation;
	@ViewChild(HeaderMenu) menu: HeaderMenu;
	@ViewChild(HeaderGlobal) global: HeaderGlobal;
	@ViewChild(HeaderAction) action: HeaderAction;

	ariaLabel = "Main navigation";
	menuTitle = "Menu title";
	trigger: "click" | "mouseover" = "click";
	isCurrentPage = false;
	actionActive = false;
	navigationItems: any[] = [];
}

describe("Header navigation", () => {
	let fixture: ComponentFixture<HeaderNavigationTest>;
	let wrapper: HeaderNavigationTest;
	const menuElement = (): any => fixture.nativeElement.querySelector("cds-header-menu");
	const menuTrigger = () => shadow<HTMLElement>(menuElement(), "[part=trigger]");

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [
				HeaderNavigationTest,
				RouterModule.forRoot([], { initialNavigation: "disabled", useHash: true })
			]
		});

		fixture = TestBed.createComponent(HeaderNavigationTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
	});

	it("should work", () => {
		expect(wrapper.navigation instanceof HeaderNavigation).toBe(true);
		expect(wrapper.menu instanceof HeaderMenu).toBe(true);
		expect(wrapper.global instanceof HeaderGlobal).toBe(true);
		expect(wrapper.action instanceof HeaderAction).toBe(true);
		expect(menuElement() instanceof customElements.get("cds-header-menu")).toBe(true);
	});

	it("should render the navigation aria label", () => {
		const nav = fixture.nativeElement.querySelector("cds-header-nav");
		expect(shadow(nav, ".cds--header__menu-bar").getAttribute("aria-label")).toBe("Main navigation");
	});

	it("should project header items and render the menu title", () => {
		expect(fixture.nativeElement.querySelector("cds-header-nav-item").textContent).toContain("Projected item");
		expect(menuElement().querySelector("cds-header-menu-item").textContent).toContain("Menu child");
		expect(menuTrigger().textContent).toContain("Menu title");
	});

	it("should expand the menu when it is clicked", async () => {
		expect(menuTrigger().getAttribute("aria-expanded")).toBe("false");

		menuTrigger().click();
		await settle(fixture);

		expect(wrapper.menu.expanded).toBe(true);
		expect(menuTrigger().getAttribute("aria-expanded")).toBe("true");
	});

	it("should expand the menu on mouseover when that is the trigger", async () => {
		wrapper.trigger = "mouseover";
		await settle(fixture);

		menuElement().dispatchEvent(new Event("mouseover"));
		await settle(fixture);

		expect(wrapper.menu.expanded).toBe(true);
		expect(menuTrigger().getAttribute("aria-expanded")).toBe("true");

		menuElement().dispatchEvent(new Event("mouseout"));
		await settle(fixture);

		expect(wrapper.menu.expanded).toBe(false);
	});

	it("should toggle the action active state when clicked", async () => {
		const action = fixture.nativeElement.querySelector("cds-header-global-action");
		expect(wrapper.action.active).toBe(false);

		action.click();
		await settle(fixture);

		expect(wrapper.action.active).toBe(true);
		expect(wrapper.actionActive).toBe(true);
		expect(shadow(action, "button").classList).toContain("cds--header__action--active");
	});

	it("should render a navigation item added to the existing array", async () => {
		expect(fixture.nativeElement.querySelectorAll("cds-header-nav-item").length).toBe(1);

		wrapper.navigationItems = [...wrapper.navigationItems, { type: "item", content: "Added item", href: "#added" }];
		await settle(fixture);

		expect(fixture.nativeElement.querySelectorAll("cds-header-nav-item").length).toBe(2);
		expect(fixture.nativeElement.textContent).toContain("Added item");
	});

	it("should mark the item as the current page", async () => {
		const item = fixture.nativeElement.querySelector("cds-header-nav-item");
		expect(shadow(item, "a").classList).not.toContain("cds--header__menu-item--current");

		wrapper.isCurrentPage = true;
		await settle(fixture);

		expect(item.isActive).toBe(true);
		expect(shadow(item, "a").classList).toContain("cds--header__menu-item--current");
	});
});
