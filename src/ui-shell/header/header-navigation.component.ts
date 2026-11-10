import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { HeaderItem } from "./header-item.component";
import { HeaderMenu } from "./header-menu.component";
import { NavigationItem } from "./header-navigation-items.interface";

/**
 * Adds `navigationItems` and `ariaLabel` to the `<cds-header-nav>` web component.
 * Project `cds-header-nav-item`s / `cds-header-menu`s, or pass `navigationItems`.
 */
@Component({
	selector: "cds-header-nav",
	template: `
		@for (item of navigationItems; track item) {
			@if (item.type === "menu") {
				<cds-header-menu [title]="item.title" [headerItems]="item.menuItems" />
			} @else {
				<cds-header-nav-item
					[href]="item.href"
					[route]="item.route"
					[routeExtras]="item.routeExtras"
					[isCurrentPage]="!!item.isCurrentPage">
					{{ item.content }}
				</cds-header-nav-item>
			}
		}
		<ng-content />
	`,
	host: {
		"[menuBarLabel]": "ariaLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HeaderItem, HeaderMenu],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderNavigation {
	@Input() ariaLabel: string;
	@Input() navigationItems: NavigationItem[];
}
