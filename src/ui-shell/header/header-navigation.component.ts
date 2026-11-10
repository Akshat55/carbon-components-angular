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
 * The header navigation. Renders the `<cds-header-nav>` web component; project items or pass `navigationItems`.
 */
@Component({
	selector: "cds-header-navigation",
	template: `
		<cds-header-nav [menuBarLabel]="ariaLabel">
			@for (item of navigationItems; track item) {
				@if (item.type === "menu") {
					<cds-header-menu [title]="item.title" [headerItems]="item.menuItems" />
				} @else {
					<cds-header-item
						[href]="item.href"
						[route]="item.route"
						[routeExtras]="item.routeExtras"
						[isCurrentPage]="!!item.isCurrentPage">
						{{ item.content }}
					</cds-header-item>
				}
			}
			<ng-content />
		</cds-header-nav>
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HeaderItem, HeaderMenu],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderNavigation {
	@Input() ariaLabel: string;
	@Input() navigationItems: NavigationItem[];
}
