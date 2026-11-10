import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Directive,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { ShellLink } from "../shell-link.class";

/**
 * Router links and `isCurrentPage` shared by `HeaderItem` and `HeaderMenuItem`.
 */
@Directive({
	host: {
		"[href]": "href ?? ''",
		"[isActive]": "isCurrentPage || routerActive",
		"(click)": "navigate($event)"
	}
})
export abstract class BaseHeaderItem extends ShellLink {
	@Input() isCurrentPage = false;
}

/**
 * Adds router navigation to the `<cds-header-nav-item>` web component (a top level header link).
 *
 * ```html
 * <cds-header-nav-item [route]="['/home']">Home</cds-header-nav-item>
 * ```
 */
@Component({
	selector: "cds-header-nav-item",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderItem extends BaseHeaderItem {}

/**
 * Adds router navigation to the `<cds-header-menu-item>` web component (a link in a `cds-header-menu`).
 */
@Component({
	selector: "cds-header-menu-item",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderMenuItem extends BaseHeaderItem {}
