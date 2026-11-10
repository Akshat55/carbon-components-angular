import { InjectionToken } from "@angular/core";

/**
 * Provided by `cds-sidenav-menu` so its `cds-sidenav-item`s render as menu items.
 */
/**
 * The parent `cds-sidenav-menu`, as seen by its items.
 */
export interface SideNavMenuRef {
	register(item: unknown, registered?: boolean): void;
	updateActiveChild(): void;
}

export const SIDE_NAV_MENU = new InjectionToken<SideNavMenuRef>("SideNavMenu");
