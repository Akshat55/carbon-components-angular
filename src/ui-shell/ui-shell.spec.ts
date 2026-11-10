import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";

import {
	Hamburger,
	Header,
	HeaderAction,
	HeaderGlobal,
	HeaderItem,
	HeaderMenu,
	HeaderMenuItem,
	HeaderNavigation,
	Panel,
	SideNav,
	SideNavItem,
	SideNavItems,
	SideNavMenuItem,
	SideNavMenu,
	SwitcherList,
	SwitcherListItem
} from "carbon-components-angular/ui-shell";

@Component({ template: "" })
class Page {}

@Component({
	template: `
		<cds-header name="Platform" skipTo="main">
			<cds-header-menu-button />
			<cds-header-nav ariaLabel="Main">
				<cds-header-nav-item href="/docs" [isCurrentPage]="true">Docs</cds-header-nav-item>
				<cds-header-menu title="More">
					<cds-header-menu-item [route]="['page']">Page</cds-header-menu-item>
				</cds-header-menu>
			</cds-header-nav>
			<cds-header-global>
				<cds-header-global-action description="Switch" ariaLabel="Switcher" [(active)]="switcherOpen"><svg></svg></cds-header-global-action>
			</cds-header-global>
			<cds-header-panel [expanded]="switcherOpen">
				<cds-switcher>
					<cds-switcher-item href="/app" [active]="true">App</cds-switcher-item>
				</cds-switcher>
			</cds-header-panel>
		</cds-header>
		<cds-side-nav [rail]="true"><cds-side-nav-items>
			<cds-side-nav-link href="/home" [active]="true"><svg slot="title-icon"></svg>Home</cds-side-nav-link>
			<cds-side-nav-menu title="Settings">
				<cds-side-nav-menu-item [route]="['page']">Profile</cds-side-nav-menu-item>
			</cds-side-nav-menu>
		</cds-side-nav-items></cds-side-nav>
	`,
	imports: [
		Header, Hamburger, HeaderNavigation, HeaderItem, HeaderMenu, HeaderMenuItem, HeaderGlobal, HeaderAction,
		Panel, SwitcherList, SwitcherListItem, SideNav, SideNavItems, SideNavItem, SideNavMenu, SideNavMenuItem
	]
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
		const navItem: any = root.querySelector("cds-header-nav > cds-header-nav-item");
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
		const link: any = sideNav.querySelector("cds-side-nav-items > cds-side-nav-link");
		expect(link.href).toBe("/home");
		expect(link.active).toBe(true);
		expect(link.querySelector("svg[slot='title-icon']")).toBeTruthy();
		const menu: any = sideNav.querySelector("cds-side-nav-menu");
		expect(menu.title).toBe("Settings");
		expect(menu.querySelector("cds-side-nav-menu-item").textContent).toContain("Profile");
	});
});
