import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { I18nModule } from "carbon-components-angular/i18n";

import { SideNav, SideNavItems } from "./sidenav.component";
import { SideNavItem, SideNavMenuItem } from "./sidenav-item.component";
import { SideNavMenu } from "./sidenav-menu.component";
import { RouterLinkExtendedDirective } from "./routerlink-extended.directive";

export { SideNavItemInterface } from "./sidenav-item.interface";

export { SideNav, SideNavItems, SideNavItem, SideNavMenuItem, SideNavMenu };

@NgModule({
	imports: [
		CommonModule,
		I18nModule,
		RouterModule,
		SideNav,
		SideNavItems,
		SideNavItem,
		SideNavMenuItem,
		SideNavMenu,
		RouterLinkExtendedDirective
	],
	exports: [
		SideNav,
		SideNavItems,
		SideNavItem,
		SideNavMenuItem,
		SideNavMenu
	]
})
export class SideNavModule {}
