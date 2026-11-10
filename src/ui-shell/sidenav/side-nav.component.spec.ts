import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { settle, shadow } from "../../test-helpers/web-components";
import { SideNav } from "./sidenav.component";
import { SideNavItem } from "./sidenav-item.component";
import { SideNavMenu } from "./sidenav-menu.component";

@Component({
	selector: "app-foo",
	template: "<h1>foo</h1>"
})
class FooComponent {}

@Component({
	template: `
		<cds-side-nav [allowExpansion]="allowExpansion" [hidden]="hidden"><cds-side-nav-items>
			<cds-side-nav-link
				[route]="route"
				[useRouter]="useRouter"
				(navigation)="onNavigation($event)">
				Link
			</cds-side-nav-link>
			<cds-side-nav-menu title="Example Title">
				<cds-side-nav-menu-item [active]="firstItemActive">One</cds-side-nav-menu-item>
				<cds-side-nav-menu-item [active]="secondItemActive">Two</cds-side-nav-menu-item>
			</cds-side-nav-menu>
		</cds-side-nav-items></cds-side-nav>
	`,
	imports: [SideNav, SideNavItem, SideNavMenu, RouterModule]
})
class SideNavTest {
	route = ["foo"];
	hidden = false;
	allowExpansion = false;
	statusPromise = null;
	useRouter = false;
	firstItemActive = false;
	secondItemActive = false;
	onNavigation(event) {
		this.statusPromise = event;
	}
}

describe("SideNav", () => {
	let fixture: ComponentFixture<SideNavTest>;
	let wrapper: SideNavTest;
	const sideNav = (): any => fixture.nativeElement.querySelector("cds-side-nav");
	const menuElement = (): any => fixture.nativeElement.querySelector("cds-side-nav-menu");
	const submenuButton = () => shadow<HTMLButtonElement>(menuElement(), ".cds--side-nav__submenu");
	const menu = () => fixture.debugElement.query(By.directive(SideNavMenu)).componentInstance as SideNavMenu;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SideNavTest,
				RouterModule.forRoot(
					[{ path: "foo", component: FooComponent }],
					{ initialNavigation: "disabled", useHash: true }
				)
			]
		});
	});

	const create = async (changes: Partial<SideNavTest> = {}) => {
		fixture = TestBed.createComponent(SideNavTest);
		wrapper = fixture.componentInstance;
		Object.assign(wrapper, changes);
		await settle(fixture);
	};

	it("should work", async () => {
		await create();
		expect(fixture.debugElement.query(By.directive(SideNav)).componentInstance instanceof SideNav).toBe(true);
		expect(sideNav() instanceof customElements.get("cds-side-nav")).toBe(true);
	});

	it("should render links outside menus and menu items inside them", async () => {
		await create();
		expect(sideNav().querySelector("cds-side-nav-items cds-side-nav-link")).toBeTruthy();
		expect(menuElement().querySelectorAll("cds-side-nav-menu-item").length).toBe(2);
	});

	it("should emit the navigation status promise when the link is activated", async () => {
		await create();
		spyOn(wrapper, "onNavigation").and.callThrough();

		fixture.nativeElement.querySelector("cds-side-nav-link").click();
		await settle(fixture);

		expect(wrapper.onNavigation).toHaveBeenCalled();
		const status = await wrapper.statusPromise;
		expect(status).toBe(true);
	});

	it("should expand the sidenav-menu on click", async () => {
		await create();
		submenuButton().click();
		await settle(fixture);
		expect(submenuButton().getAttribute("aria-expanded")).toBe("true");
		expect(menu().expanded).toBe(true);

		submenuButton().click();
		await settle(fixture);
		expect(submenuButton().getAttribute("aria-expanded")).toBe("false");
		expect(menu().expanded).toBe(false);
	});

	it("should set the sidenav-menu title to Example Title", async () => {
		await create();
		expect(shadow(menuElement(), ".cds--side-nav__submenu-title").textContent.trim()).toEqual("Example Title");
	});

	it("should toggle expanded", async () => {
		await create({ allowExpansion: true });
		const component = fixture.debugElement.query(By.directive(SideNav)).componentInstance as SideNav;

		component.toggle();
		await settle(fixture);
		expect(component.expanded).toBe(false);
		expect(sideNav().expanded).toBe(false);

		component.toggle();
		await settle(fixture);
		expect(component.expanded).toBe(true);
		expect(sideNav().expanded).toBe(true);
	});

	it("should mirror the web component collapsing itself", async () => {
		await create({ allowExpansion: true });
		const component = fixture.debugElement.query(By.directive(SideNav)).componentInstance as SideNav;

		sideNav().expanded = false;
		await settle(fixture);

		expect(component.expanded).toBe(false);
	});

	it("should mark the menu active when one of its items is selected", async () => {
		await create();
		expect(menu().hasActiveChild).toBe(false);
		expect(menuElement().active).toBe(false);

		wrapper.secondItemActive = true;
		await settle(fixture);

		expect(menu().hasActiveChild).toBe(true);
		expect(menuElement().active).toBe(true);
	});

	it("should clear the active menu when the item is deselected", async () => {
		await create({ firstItemActive: true });
		expect(menuElement().active).toBe(true);

		wrapper.firstItemActive = false;
		await settle(fixture);

		expect(menu().hasActiveChild).toBe(false);
		expect(menuElement().active).toBe(false);
	});
});
