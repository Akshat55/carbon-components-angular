import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { observeAttribute } from "carbon-components-angular/utils";
import { NavigationItem } from "../header/header-navigation-items.interface";
import { SideNavItem } from "./sidenav-item.component";
import { SideNavMenu } from "./sidenav-menu.component";

/**
 * Adds `[expanded]`, `navigationItems` and Angular inputs to the `<cds-side-nav>` web component.
 * Put links and menus in a `cds-side-nav-items`, or pass `navigationItems`.
 *
 * ```html
 * <cds-side-nav>
 * 	<cds-side-nav-items>
 * 		<cds-side-nav-link href="#">Link</cds-side-nav-link>
 * 	</cds-side-nav-items>
 * </cds-side-nav>
 * ```
 *
 * [See demo](../../?path=/story/components-ui-shell--side-navigation)
 */
@Component({
	selector: "cds-side-nav",
	template: `
		@if (navigationItems) {
			<cds-side-nav-items>
				@for (item of navigationItems; track item) {
					@if (item.type === "menu") {
						<cds-side-nav-menu [title]="item.title" [useRouter]="useRouter" [menuItems]="item.menuItems" />
					} @else {
						<cds-side-nav-link
							[href]="item.href"
							[route]="item.route"
							[routeExtras]="item.routeExtras"
							[useRouter]="useRouter"
							[title]="item.title">
							{{ item.content }}
						</cds-side-nav-link>
					}
				}
			</cds-side-nav-items>
		}
		<ng-content />
	`,
	host: {
		"[expanded]": "expanded",
		"[collapseMode]": "rail ? 'rail' : allowExpansion ? 'responsive' : 'fixed'",
		"[hidden]": "hidden",
		"[attr.aria-label]": "ariaLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SideNavItem, SideNavMenu],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SideNav {
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

	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		// The hamburger (`cds-header-menu-button`) expands and collapses the web component.
		observeAttribute(inject(ElementRef).nativeElement, "expanded", inject(DestroyRef), expanded => {
			this.expanded = expanded;
			this.changeDetectorRef.markForCheck();
		});
	}

	toggle() {
		this.expanded = !this.expanded;
		this.changeDetectorRef.markForCheck();
	}
}

/**
 * The `<cds-side-nav-items>` web component, the container of a side nav's links and menus.
 */
@Component({
	selector: "cds-side-nav-items",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SideNavItems {}
