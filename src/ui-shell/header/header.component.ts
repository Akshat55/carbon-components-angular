import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	TemplateRef,
	inject
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/ui-shell/index.js";
import "@carbon/web-components/es/components/skip-to-content/index.js";
import { I18n } from "carbon-components-angular/i18n";
import { ShellLink } from "../shell-link.class";

/**
 * Wraps the `<cds-header>` web component and renders the product name.
 *
 * ```html
 * <cds-header name="Platform" skipTo="main">
 * 	<cds-header-menu-button />
 * 	<cds-header-nav>...</cds-header-nav>
 * 	<cds-header-global>...</cds-header-global>
 * </cds-header>
 * ```
 *
 * [See demo](../../?path=/story/components-ui-shell--header)
 */
@Component({
	selector: "cds-header",
	template: `
		@if (skipTo) {
			<cds-skip-to-content [href]="'#' + skipTo">{{ i18n.get().UI_SHELL.SKIP_TO }}</cds-skip-to-content>
		}
		<ng-content select="cds-header-menu-button" />
		<cds-header-name [href]="href ?? ''" [prefix]="isTemplate(brand) ? '' : brand" (click)="navigate($event)">
			@if (isTemplate(brand)) {
				<ng-template [ngTemplateOutlet]="brand" />
			}
			{{ name }}
		</cds-header-name>
		<ng-content />
	`,
	host: {
		"[attr.aria-label]": "(isTemplate(brand) ? '' : brand + ' ') + (name ?? '')"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Header extends ShellLink {
	i18n = inject(I18n);

	/**
	 * Id of the main content, for the skip-to-content link.
	 */
	@Input() skipTo: string;
	@Input() name: string;
	@Input() brand: string | TemplateRef<any> = "IBM";

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
