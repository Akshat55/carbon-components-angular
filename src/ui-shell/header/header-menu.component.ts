import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { HeaderItem } from "./header-item.component";
import { HeaderItemInterface } from "./header-navigation-items.interface";
import { HEADER_MENU } from "./header-menu.token";

/**
 * Wraps the `<cds-header-menu>` web component. Project `cds-header-item`s or pass `headerItems`.
 */
@Component({
	selector: "cds-header-menu",
	template: `
		@for (item of headerItems; track item) {
			<cds-header-item [href]="item.href" [route]="item.route" [routeExtras]="item.routeExtras" [useRouter]="useRouter">
				{{ item.content }}
			</cds-header-item>
		}
		<ng-content />
	`,
	host: {
		"[triggerContent]": "title",
		"[menuLabel]": "title"
	},
	providers: [{ provide: HEADER_MENU, useValue: true }],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HeaderItem],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderMenu {
	@Input() title: string;
	@Input() headerItems: HeaderItemInterface[];
	@Input() useRouter = false;
	/**
	 * @deprecated the web component opens on click.
	 */
	@Input() trigger: "click" | "mouseover" = "click";
	/**
	 * @deprecated
	 */
	@Input() href: string;
	/**
	 * @deprecated the web component renders its own chevron.
	 */
	@Input() icon: TemplateRef<any>;
}
