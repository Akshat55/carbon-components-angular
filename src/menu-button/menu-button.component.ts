import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/menu-button/index.js";
import "@carbon/web-components/es/components/menu/index.js";

type MenuButtonPlacement = "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end";

/**
 * Wraps the `<cds-menu-button>` web component. Project `cds-menu-item`s / `cds-menu-divider`s.
 *
 * [See demo](../../?path=/story/components-menu-button--basic)
 */
@Component({
	selector: "cds-menu-button",
	template: `
		<cds-menu [id]="menuId" [size]="size">
			<ng-content />
		</cds-menu>
	`,
	host: {
		"[label]": "label",
		"[kind]": "kind",
		"[size]": "size",
		"[menuAlignment]": "menuAlignment",
		"[disabled]": "disabled",
		"[tabIndex]": "buttonTabIndex"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuButtonComponent {
	static menuButtonCounter = 0;

	@Input() menuId = `menu-button-${MenuButtonComponent.menuButtonCounter++}`;
	@Input() kind: "primary" | "tertiary" | "ghost" = "primary";
	@Input() size: "xs" | "sm" | "md" | "lg" = "lg";
	@Input() menuAlignment: MenuButtonPlacement = "bottom";
	@Input() buttonTabIndex: "0" | "1" | "-1" | string = "0";
	@Input() disabled = false;
	@Input() label: string;
	/**
	 * @deprecated the web component opens and closes its own menu.
	 */
	@Input() open = false;
}
