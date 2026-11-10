import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/menu-button/index.js";
import "@carbon/web-components/es/components/menu/index.js";

type MenuButtonPlacement = "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end";

/**
 * Adds Angular inputs and `[open]` to the `<cds-menu-button>` web component. Put its items in a `cds-menu`.
 *
 * ```html
 * <cds-menu-button label="Actions">
 * 	<cds-menu>
 * 		<cds-menu-item label="Edit" />
 * 	</cds-menu>
 * </cds-menu-button>
 * ```
 *
 * [See demo](../../?path=/story/components-menu-button--basic)
 */
@Component({
	selector: "cds-menu-button",
	template: "<ng-content />",
	host: {
		"[label]": "label",
		"[kind]": "kind",
		"[size]": "size",
		"[menuAlignment]": "menuAlignment",
		"[disabled]": "disabled",
		"[tabIndex]": "buttonTabIndex",
		"[_open]": "open"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuButtonComponent {
	@Input() kind: "primary" | "tertiary" | "ghost" = "primary";
	@Input() size: "xs" | "sm" | "md" | "lg" = "lg";
	@Input() menuAlignment: MenuButtonPlacement = "bottom";
	@Input() buttonTabIndex: "0" | "1" | "-1" | string = "0";
	@Input() disabled = false;
	@Input() label: string;
	/**
	 * Whether the menu is open. Kept in sync when the user opens or closes it.
	 */
	@Input() open = false;

	protected elementRef = inject(ElementRef);
	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		// The web component keeps its open state private (`_open`); read it back after each interaction.
		["click", "keydown", "focusout", "cds-menu-closed"].forEach(type =>
			this.elementRef.nativeElement.addEventListener(type, () => this.syncOpen(), { capture: true })
		);
	}

	protected syncOpen() {
		setTimeout(async () => {
			const element = this.elementRef.nativeElement;
			await element.updateComplete;
			if (element._open !== this.open) {
				this.open = element._open;
				this.changeDetectorRef.markForCheck();
			}
		});
	}
}
