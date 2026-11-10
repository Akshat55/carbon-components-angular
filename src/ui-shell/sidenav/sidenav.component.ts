import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { I18n } from "carbon-components-angular/i18n";
import { NavigationItem } from "../header/header-navigation-items.interface";
import { SideNavItem } from "./sidenav-item.component";
import { SideNavMenu } from "./sidenav-menu.component";

/**
 * The side navigation. Renders the `<cds-side-nav>` web component; project items or pass `navigationItems`.
 *
 * [See demo](../../?path=/story/components-ui-shell--side-navigation)
 */
@Component({
	selector: "cds-sidenav",
	template: `
		<cds-side-nav
			[expanded]="expanded"
			[collapseMode]="rail ? 'rail' : allowExpansion ? 'responsive' : 'fixed'"
			[hidden]="hidden"
			[attr.aria-label]="ariaLabel">
			<cds-side-nav-items>
				@for (item of navigationItems; track item) {
					@if (item.type === "menu") {
						<cds-sidenav-menu [title]="item.title" [useRouter]="useRouter" [menuItems]="item.menuItems" />
					} @else {
						<cds-sidenav-item
							[href]="item.href"
							[route]="item.route"
							[routeExtras]="item.routeExtras"
							[useRouter]="useRouter"
							[title]="item.title">
							{{ item.content }}
						</cds-sidenav-item>
					}
				}
				<ng-content />
			</cds-side-nav-items>
		</cds-side-nav>
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SideNavItem, SideNavMenu],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SideNav {
	i18n = inject(I18n);

	@Input() ariaLabel = "Side navigation";
	@Input() expanded = true;
	@Input() hidden = false;
	/**
	 * Collapses to a rail of icons.
	 */
	@Input() rail = false;
	@Input() allowExpansion = false;
	@Input() navigationItems: NavigationItem[];
	@Input() useRouter = false;

	toggle() {
		this.expanded = !this.expanded;
	}
}
