import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	ElementRef,
	Input,
	OnInit,
	ViewChild,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { observeAttribute } from "carbon-components-angular/utils";
import { SideNavItem } from "./sidenav-item.component";
import { SideNavItemInterface } from "./sidenav-item.interface";
import { SIDE_NAV_MENU } from "./sidenav-menu.token";

/**
 * A collapsible side navigation menu. Renders the `<cds-side-nav-menu>` web component.
 */
@Component({
	selector: "cds-sidenav-menu",
	template: `
		<cds-side-nav-menu #menu [title]="title" [expanded]="expanded" [active]="hasActiveChild">
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
	providers: [{ provide: SIDE_NAV_MENU, useExisting: SideNavMenu }],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SideNavItem],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SideNavMenu implements OnInit {
	@Input() title: string;
	@Input() expanded = false;
	/**
	 * Highlights the menu while one of its items is active.
	 */
	@Input() hasActiveChild = false;
	@Input() menuItems: SideNavItemInterface[];
	@Input() useRouter = false;

	@ViewChild("menu", { static: true }) menu: ElementRef<HTMLElement>;

	protected items = new Set<SideNavItem>();
	protected changeDetectorRef = inject(ChangeDetectorRef);
	protected destroyRef = inject(DestroyRef);

	ngOnInit() {
		observeAttribute(this.menu.nativeElement, "expanded", this.destroyRef, expanded => {
			this.expanded = expanded;
			this.changeDetectorRef.markForCheck();
		});
	}

	/**
	 * Called by the menu's items when they are created and destroyed.
	 */
	register(item: SideNavItem, registered = true) {
		if (registered) {
			this.items.add(item);
		} else {
			this.items.delete(item);
		}
		this.updateActiveChild();
	}

	/**
	 * Highlights the menu while one of its items is active.
	 */
	updateActiveChild() {
		// Deferred: items update while this menu's view is being checked.
		Promise.resolve().then(() => {
			const hasActiveChild = [...this.items].some(item => item.isActive);
			if (hasActiveChild !== this.hasActiveChild) {
				this.hasActiveChild = hasActiveChild;
				this.changeDetectorRef.markForCheck();
			}
		});
	}
}
