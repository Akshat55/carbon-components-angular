import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	ElementRef,
	Input,
	TemplateRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { observeAttribute } from "carbon-components-angular/utils";
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
		"[menuLabel]": "title",
		"[expanded]": "expanded",
		"(mouseover)": "trigger === 'mouseover' && (expanded = true)",
		"(mouseout)": "trigger === 'mouseover' && (expanded = false)"
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
	 * Opens the menu on click, or while the pointer is over it.
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

	expanded = false;

	constructor() {
		const changeDetectorRef = inject(ChangeDetectorRef);
		observeAttribute(inject(ElementRef).nativeElement, "expanded", inject(DestroyRef), expanded => {
			this.expanded = expanded;
			changeDetectorRef.markForCheck();
		});
	}
}
