import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	inject
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { ShellLink } from "../shell-link.class";
import { SIDE_NAV_MENU } from "./sidenav-menu.token";

/**
 * A side navigation link. Renders `<cds-side-nav-link>`, or `<cds-side-nav-menu-item>` inside
 * a `cds-sidenav-menu`. Project an `svg` (or `[icon]`) for the icon.
 */
@Component({
	selector: "cds-sidenav-item",
	template: `
		<ng-template #icon><ng-content select="svg, [icon]" /></ng-template>
		<ng-template #content><ng-content /></ng-template>
		@if (inMenu || isSubMenu) {
			<cds-side-nav-menu-item [href]="href ?? ''" [active]="isActive" [title]="title ?? ''" (click)="onClick($event)">
				<ng-container *ngTemplateOutlet="content" />
			</cds-side-nav-menu-item>
		} @else {
			<cds-side-nav-link [href]="href ?? ''" [active]="isActive" [title]="title ?? ''" (click)="onClick($event)">
				<span slot="title-icon"><ng-container *ngTemplateOutlet="icon" /></span>
				<ng-container *ngTemplateOutlet="content" />
			</cds-side-nav-link>
		}
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SideNavItem extends ShellLink implements OnInit, OnDestroy {
	@Input() set active(value: boolean) {
		this._active = value;
		this.menu?.updateActiveChild();
	}
	get active() {
		return this._active;
	}
	@Input() isSubMenu = false;
	@Input() title: string;

	/**
	 * Emits `true` when the item is clicked.
	 */
	@Output() selected = new EventEmitter<boolean>();

	protected menu = inject(SIDE_NAV_MENU, { optional: true });
	protected inMenu = !!this.menu;
	protected _active = false;

	get isActive() {
		return this.active || this.routerActive;
	}

	ngOnInit() {
		this.menu?.register(this);
	}

	ngOnDestroy() {
		this.menu?.register(this, false);
	}

	onClick(event: Event) {
		this.selected.emit(true);
		this.navigate(event);
	}

	protected onRouterActiveChange() {
		this.menu?.updateActiveChild();
	}
}
