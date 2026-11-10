import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";

import {
	Hamburger,
	Header,
	HeaderAction,
	HeaderGlobal,
	HeaderItem,
	HeaderMenu,
	HeaderNavigation,
	Panel,
	SideNav,
	SideNavItem,
	SideNavMenu,
	SwitcherList,
	SwitcherListItem
} from "carbon-components-angular/ui-shell";

@Component({ template: "" })
class Page {}

@Component({
	template: `
		<cds-header name="Platform" skipTo="main">
			<cds-hamburger />
			<cds-header-navigation ariaLabel="Main">
				<cds-header-item href="/docs" [isCurrentPage]="true">Docs</cds-header-item>
				<cds-header-menu title="More">
					<cds-header-item [route]="['page']">Page</cds-header-item>
				</cds-header-menu>
			</cds-header-navigation>
			<cds-header-global>
				<cds-header-action description="Switch" ariaLabel="Switcher" [(active)]="switcherOpen"><svg></svg></cds-header-action>
			</cds-header-global>
			<cds-panel [expanded]="switcherOpen">
				<cds-switcher-list>
					<cds-switcher-list-item href="/app" [active]="true">App</cds-switcher-list-item>
				</cds-switcher-list>
			</cds-panel>
		</cds-header>
		<cds-sidenav [rail]="true">
			<cds-sidenav-item href="/home" [active]="true"><svg></svg>Home</cds-sidenav-item>
			<cds-sidenav-menu title="Settings">
				<cds-sidenav-item [route]="['page']">Profile</cds-sidenav-item>
			</cds-sidenav-menu>
		</cds-sidenav>
	`,
	imports: [
		Header, Hamburger, HeaderNavigation, HeaderItem, HeaderMenu, HeaderGlobal, HeaderAction,
		Panel, SwitcherList, SwitcherListItem, SideNav, SideNavItem, SideNavMenu
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class ShellTest {
	switcherOpen = false;
}

describe("UI shell", () => {
	let fixture;
	let root: HTMLElement;

	beforeEach(() => {
		TestBed.configureTestingModule({ providers: [provideRouter([{ path: "page", component: Page }])] });
		fixture = TestBed.createComponent(ShellTest);
		fixture.detectChanges();
		root = fixture.nativeElement;
	});

	it("should render the header web components", () => {
		const header: any = root.querySelector("cds-header");
		expect(header instanceof customElements.get("cds-header")).toBe(true);
		expect(header.querySelector("cds-header-name").textContent).toContain("Platform");
		expect(header.querySelector("cds-skip-to-content").href).toBe("#main");
		expect(header.querySelector("cds-header-menu-button")).toBeTruthy();
		expect(header.querySelector("cds-header-nav").menuBarLabel).toBe("Main");
	});

	it("should render header items as nav items, or menu items inside a menu", () => {
		const navItem: any = root.querySelector("cds-header-nav > cds-header-item > cds-header-nav-item");
		expect(navItem.href).toBe("/docs");
		expect(navItem.isActive).toBe(true);
		const menu: any = root.querySelector("cds-header-menu");
		expect(menu.triggerContent).toBe("More");
		expect(menu.querySelector("cds-header-menu-item").textContent).toContain("Page");
	});

	it("should navigate routes with the Angular router", () => {
		const router = TestBed.inject(Router);
		spyOn(router, "navigate").and.returnValue(Promise.resolve(true));
		root.querySelector<HTMLElement>("cds-header-menu-item").click();
		expect(router.navigate).toHaveBeenCalledWith(["page"], undefined);
	});

	it("should toggle the header action with two-way binding", () => {
		const action: any = root.querySelector("cds-header-global-action");
		expect(action.querySelector("[slot='tooltip-content']").textContent.trim()).toBe("Switch");
		action.click();
		fixture.detectChanges();
		expect(fixture.componentInstance.switcherOpen).toBe(true);
		expect((root.querySelector("cds-header-panel") as any).expanded).toBe(true);
		expect((root.querySelector("cds-switcher-item") as any).selected).toBe(true);
	});

	it("should render the side nav with links and menus", () => {
		const sideNav: any = root.querySelector("cds-side-nav");
		expect(sideNav instanceof customElements.get("cds-side-nav")).toBe(true);
		expect(sideNav.collapseMode).toBe("rail");
		const link: any = sideNav.querySelector("cds-side-nav-items > cds-sidenav-item > cds-side-nav-link");
		expect(link.href).toBe("/home");
		expect(link.active).toBe(true);
		expect(link.querySelector("[slot='title-icon'] svg")).toBeTruthy();
		const menu: any = sideNav.querySelector("cds-side-nav-menu");
		expect(menu.title).toBe("Settings");
		expect(menu.querySelector("cds-side-nav-menu-item").textContent).toContain("Profile");
	});
});
