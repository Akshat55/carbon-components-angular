import {
	booleanAttribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	Output,
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
		"[label]": "label ?? element.label",
		"[kind]": "kind ?? element.kind",
		"[size]": "size ?? element.size",
		"[menuAlignment]": "menuAlignment ?? element.menuAlignment",
		"[disabled]": "disabled ?? element.disabled",
		"[tabIndex]": "buttonTabIndex ?? element.tabIndex",
		"[_open]": "open ?? element._open"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuButtonComponent {
	/**
	 * @deprecated the web component doesn't link its trigger to the menu by id.
	 */
	@Input() menuId?: string;
	/**
	 * The web component's default is `"primary"`.
	 */
	@Input() kind?: "primary" | "tertiary" | "ghost";
	/**
	 * The web component's default is `"lg"`.
	 */
	@Input() size?: "xs" | "sm" | "md" | "lg";
	/**
	 * The web component's default is `"bottom"`.
	 */
	@Input() menuAlignment?: MenuButtonPlacement;
	@Input() buttonTabIndex?: "0" | "1" | "-1" | string;
	@Input({ transform: booleanAttribute }) disabled?: boolean;
	@Input() label: string;
	/**
	 * Whether the menu is open. Supports two-way binding with `openChange`.
	 */
	@Input({ transform: booleanAttribute }) open?: boolean;

	@Output() openChange = new EventEmitter<boolean>();

	protected elementRef = inject(ElementRef);
	protected element = this.elementRef.nativeElement;
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
			if (element._open !== !!this.open) {
				this.open = element._open;
				this.openChange.emit(this.open);
				this.changeDetectorRef.markForCheck();
			}
		});
	}
}
