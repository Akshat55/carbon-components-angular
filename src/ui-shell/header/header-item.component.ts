import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	inject
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { ShellLink } from "../shell-link.class";
import { HEADER_MENU } from "./header-menu.token";

/**
 * A header link. Renders `<cds-header-nav-item>`, or `<cds-header-menu-item>` inside a `cds-header-menu`.
 */
@Component({
	selector: "cds-header-item",
	template: `
		<ng-template #content><ng-content /></ng-template>
		@if (inMenu) {
			<cds-header-menu-item [href]="href ?? ''" [isActive]="isCurrentPage || routerActive" (click)="navigate($event)">
				<ng-container *ngTemplateOutlet="content" />
			</cds-header-menu-item>
		} @else {
			<cds-header-nav-item [href]="href ?? ''" [isActive]="isCurrentPage || routerActive" (click)="navigate($event)">
				<ng-container *ngTemplateOutlet="content" />
			</cds-header-nav-item>
		}
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderItem extends ShellLink {
	@Input() isCurrentPage: boolean;
	/**
	 * @deprecated the web component styles the current page.
	 */
	@Input() activeLinkClass: string | string[];

	protected inMenu = !!inject(HEADER_MENU, { optional: true });
}
