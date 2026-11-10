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
import { HeaderMenuItem } from "./header-item.component";
import { HeaderItemInterface } from "./header-navigation-items.interface";

/**
 * Wraps the `<cds-header-menu>` web component. Project `cds-header-nav-item`s or pass `headerItems`.
 */
@Component({
	selector: "cds-header-menu",
	template: `
		@for (item of headerItems; track item) {
			<cds-header-menu-item [href]="item.href" [route]="item.route" [routeExtras]="item.routeExtras" [useRouter]="useRouter">
				{{ item.content }}
			</cds-header-menu-item>
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
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HeaderMenuItem],
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
