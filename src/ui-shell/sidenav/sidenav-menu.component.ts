import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { SideNavItem } from "./sidenav-item.component";
import { SideNavItemInterface } from "./sidenav-item.interface";
import { SIDE_NAV_MENU } from "./sidenav-menu.token";

/**
 * A collapsible side navigation menu. Renders the `<cds-side-nav-menu>` web component.
 */
@Component({
	selector: "cds-sidenav-menu",
	template: `
		<cds-side-nav-menu [title]="title" [expanded]="expanded" [active]="hasActiveChild">
			<span slot="title-icon"><ng-content select="svg, [icon]" /></span>
			@for (item of menuItems; track item) {
				<cds-sidenav-item
					[href]="item.href"
					[route]="item.route"
					[routeExtras]="item.routeExtras"
					[active]="!!item.active"
					[useRouter]="useRouter">
					{{ item.content }}
				</cds-sidenav-item>
			}
			<ng-content />
		</cds-side-nav-menu>
	`,
	styles: [":host { display: contents; }"],
	providers: [{ provide: SIDE_NAV_MENU, useValue: true }],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SideNavItem],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SideNavMenu {
	@Input() title: string;
	@Input() expanded = false;
	/**
	 * Highlights the menu while one of its items is active.
	 */
	@Input() hasActiveChild = false;
	@Input() menuItems: SideNavItemInterface[];
	@Input() useRouter = false;
}
