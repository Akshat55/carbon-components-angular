import {
	booleanAttribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { observeAttributes } from "carbon-components-angular/utils";
import { SideNavMenuItem } from "./sidenav-item.component";
import { SideNavItemInterface } from "./sidenav-item.interface";

/**
 * Adds `menuItems` and `[expanded]` to the `<cds-side-nav-menu>` web component.
 * Project `cds-side-nav-menu-item`s or pass `menuItems`.
 */
@Component({
	selector: "cds-side-nav-menu",
	template: `
		@for (item of menuItems; track item) {
			<cds-side-nav-menu-item
				[href]="item.href"
				[route]="item.route"
				[routeExtras]="item.routeExtras"
				[active]="!!item.active"
				[useRouter]="useRouter">
				{{ item.content }}
			</cds-side-nav-menu-item>
		}
		<ng-content />
	`,
	host: {
		"[title]": "title",
		"[expanded]": "expanded",
		"[active]": "active"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SideNavMenuItem],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SideNavMenu {
	@Input() title: string;
	@Input({ transform: booleanAttribute }) expanded = false;
	@Input() menuItems: SideNavItemInterface[];
	@Input({ transform: booleanAttribute }) useRouter = false;
	/**
	 * Highlights the menu, e.g. while one of its items is the current page.
	 */
	@Input({ transform: booleanAttribute }) active = false;

	/**
	 * `true` while one of the menu's items is active.
	 */
	protected element = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		observeAttributes(this.element, ["expanded"], () => {
			this.expanded = this.element.expanded;
			this.changeDetectorRef.markForCheck();
		});
	}
}
