import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { I18nModule } from "carbon-components-angular/i18n";

import { HeaderModule } from "./header/header.module";
import { SideNavModule } from "./sidenav/sidenav.module";
import { PanelModule } from "./panel/panel.module";
import { HeaderName, HeaderSideNavItems } from "./header/header-parts.component";
import { SideNavDivider } from "./sidenav/sidenav-divider.component";
import { SwitcherDivider } from "./panel/switcher-divider.component";

@NgModule({
	imports: [
		CommonModule,
		I18nModule,
		HeaderModule,
		SideNavModule,
		PanelModule,
		HeaderName,
		HeaderSideNavItems,
		SideNavDivider,
		SwitcherDivider
	],
	exports: [
		HeaderModule,
		SideNavModule,
		PanelModule,
		HeaderName,
		HeaderSideNavItems,
		SideNavDivider,
		SwitcherDivider
	]
})
export class UIShellModule {}
