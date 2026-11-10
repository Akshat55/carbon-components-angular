import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
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
			<cds-side-nav-menu-item [href]="href ?? ''" [active]="active || routerActive" [title]="title ?? ''" (click)="onClick($event)">
				<ng-container *ngTemplateOutlet="content" />
			</cds-side-nav-menu-item>
		} @else {
			<cds-side-nav-link [href]="href ?? ''" [active]="active || routerActive" [title]="title ?? ''" (click)="onClick($event)">
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
export class SideNavItem extends ShellLink {
	@Input() active = false;
	@Input() isSubMenu = false;
	@Input() title: string;

	/**
	 * Emits `true` when the item is clicked.
	 */
	@Output() selected = new EventEmitter<boolean>();

	protected inMenu = !!inject(SIDE_NAV_MENU, { optional: true });

	onClick(event: Event) {
		this.selected.emit(true);
		this.navigate(event);
	}
}
