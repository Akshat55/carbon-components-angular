import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Directive,
	EventEmitter,
	Input,
	Output
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { ShellLink } from "../shell-link.class";

/**
 * Router links, `active` and `(selected)` shared by `SideNavItem` and `SideNavMenuItem`.
 */
@Directive({
	host: {
		"[href]": "href ?? ''",
		"[active]": "active || routerActive",
		"[title]": "title ?? ''",
		"(click)": "onClick($event)"
	}
})
export abstract class BaseSideNavItem extends ShellLink {
	@Input() active = false;
	@Input() title: string;

	@Output() selected = new EventEmitter<boolean>();

	onClick(event: Event) {
		this.selected.emit(true);
		this.navigate(event);
	}
}

/**
 * Adds router navigation to the `<cds-side-nav-link>` web component.
 * Put an icon in its `title-icon` slot.
 *
 * ```html
 * <cds-side-nav-link [route]="['/home']">
 * 	<svg cdsIcon="home" size="16" slot="title-icon"></svg>
 * 	Home
 * </cds-side-nav-link>
 * ```
 */
@Component({
	selector: "cds-side-nav-link",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SideNavItem extends BaseSideNavItem {}

/**
 * Adds router navigation to the `<cds-side-nav-menu-item>` web component (a link in a `cds-side-nav-menu`).
 */
@Component({
	selector: "cds-side-nav-menu-item",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SideNavMenuItem extends BaseSideNavItem {}
