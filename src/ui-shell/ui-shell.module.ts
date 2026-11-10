/**
 * Copyright IBM Corp. 2024
 *
 * UIShellModule
 *
 * Drop-in replacement for the old carbon-components-angular UIShellModule.
 * Registers the ui-shell web components and exports the thin Angular
 * directives that map the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSHeader from "@carbon/web-components/es/components/ui-shell/header.js";
import CDSHeaderName from "@carbon/web-components/es/components/ui-shell/header-name.js";
import CDSHeaderNav from "@carbon/web-components/es/components/ui-shell/header-nav.js";
import CDSHeaderNavItem from "@carbon/web-components/es/components/ui-shell/header-nav-item.js";
import CDSHeaderMenu from "@carbon/web-components/es/components/ui-shell/header-menu.js";
import CDSHeaderMenuItem from "@carbon/web-components/es/components/ui-shell/header-menu-item.js";
import CDSHeaderMenuButton from "@carbon/web-components/es/components/ui-shell/header-menu-button.js";
import CDSHeaderGlobalAction from "@carbon/web-components/es/components/ui-shell/header-global-action.js";
import CDSHeaderPanel from "@carbon/web-components/es/components/ui-shell/header-panel.js";
import CDSSideNav from "@carbon/web-components/es/components/ui-shell/side-nav.js";
import CDSSideNavItems from "@carbon/web-components/es/components/ui-shell/side-nav-items.js";
import CDSSideNavLink from "@carbon/web-components/es/components/ui-shell/side-nav-link.js";
import CDSSideNavMenu from "@carbon/web-components/es/components/ui-shell/side-nav-menu.js";
import CDSSideNavMenuItem from "@carbon/web-components/es/components/ui-shell/side-nav-menu-item.js";
import CDSSwitcher from "@carbon/web-components/es/components/ui-shell/switcher.js";
import CDSSwitcherItem from "@carbon/web-components/es/components/ui-shell/switcher-item.js";
import CDSSwitcherDivider from "@carbon/web-components/es/components/ui-shell/switcher-divider.js";

import {
	CdsHeaderDirective,
	CdsHamburgerDirective,
	CdsHeaderNavDirective,
	CdsHeaderItemDirective,
	CdsHeaderMenuDirective,
	CdsHeaderGlobalActionDirective,
	CdsSideNavDirective,
	CdsSideNavItemDirective,
	CdsSideNavMenuDirective,
	CdsHeaderPanelDirective,
	CdsSwitcherItemDirective
} from "./ui-shell.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-header", CDSHeader);
safeDefine("cds-header-name", CDSHeaderName);
safeDefine("cds-header-nav", CDSHeaderNav);
safeDefine("cds-header-nav-item", CDSHeaderNavItem);
safeDefine("cds-header-menu", CDSHeaderMenu);
safeDefine("cds-header-menu-item", CDSHeaderMenuItem);
safeDefine("cds-header-menu-button", CDSHeaderMenuButton);
safeDefine("cds-header-global-action", CDSHeaderGlobalAction);
safeDefine("cds-header-panel", CDSHeaderPanel);
safeDefine("cds-side-nav", CDSSideNav);
safeDefine("cds-side-nav-items", CDSSideNavItems);
safeDefine("cds-side-nav-link", CDSSideNavLink);
safeDefine("cds-side-nav-menu", CDSSideNavMenu);
safeDefine("cds-side-nav-menu-item", CDSSideNavMenuItem);
safeDefine("cds-switcher", CDSSwitcher);
safeDefine("cds-switcher-item", CDSSwitcherItem);
safeDefine("cds-switcher-divider", CDSSwitcherDivider);

const DIRECTIVES = [
	CdsHeaderDirective,
	CdsHamburgerDirective,
	CdsHeaderNavDirective,
	CdsHeaderItemDirective,
	CdsHeaderMenuDirective,
	CdsHeaderGlobalActionDirective,
	CdsSideNavDirective,
	CdsSideNavItemDirective,
	CdsSideNavMenuDirective,
	CdsHeaderPanelDirective,
	CdsSwitcherItemDirective
];

@NgModule({
	imports: [CommonModule, ...DIRECTIVES],
	exports: DIRECTIVES,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UIShellModule { }
