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
import { SideNavMenuItem } from "./sidenav-item.component";
import { SideNavItemInterface } from "./sidenav-item.interface";

/**
 * Adds `menuItems`, `[expanded]` and active-child tracking to the `<cds-side-nav-menu>`
 * web component. Project `cds-side-nav-menu-item`s or pass `menuItems`.
 *
 * The menu is highlighted while one of its items is `active`; items are read from the DOM,
 * so items created any way (templates, `@for`, `createComponent`) count.
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
		"[active]": "hasActiveChild"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SideNavMenuItem],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SideNavMenu {
	@Input() title: string;
	@Input() expanded = false;
	@Input() menuItems: SideNavItemInterface[];
	@Input() useRouter = false;

	/**
	 * `true` while one of the menu's items is active.
	 */
	hasActiveChild = false;

	protected element: HTMLElement = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		const destroyRef = inject(DestroyRef);
		observeAttribute(this.element, "expanded", destroyRef, expanded => {
			this.expanded = expanded;
			this.changeDetectorRef.markForCheck();
		});
		// Items reflect `active`; watch them (and items being added or removed).
		const observer = new MutationObserver(() => this.updateActiveChild());
		observer.observe(this.element, { childList: true, subtree: true, attributes: true, attributeFilter: ["active"] });
		destroyRef.onDestroy(() => observer.disconnect());
	}

	protected updateActiveChild() {
		const hasActiveChild = !!this.element.querySelector("cds-side-nav-menu-item[active]");
		if (hasActiveChild !== this.hasActiveChild) {
			this.hasActiveChild = hasActiveChild;
			this.changeDetectorRef.markForCheck();
		}
	}
}
