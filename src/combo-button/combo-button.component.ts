import {
	booleanAttribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	ElementRef,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/combo-button/index.js";
import "@carbon/web-components/es/components/menu/index.js";

type ComboButtonPlacement = "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end";

/**
 * Adds Angular inputs, `[open]` and `(actionClick)` to the `<cds-combo-button>` web component:
 * a primary action plus a menu. Put its items in a `cds-menu`.
 *
 * [See demo](../../?path=/story/components-combo-button--basic)
 */
@Component({
	selector: "cds-combo-button",
	template: "<ng-content />",
	host: {
		"[label]": "label ?? element.label",
		"[size]": "size ?? element.size",
		"[disabled]": "disabled ?? element.disabled",
		"[menuAlignment]": "menuAlignment ?? element.menuAlignment",
		"[tooltipContent]": "description ?? element.tooltipContent",
		"[tooltipAlignment]": "tooltipPlacement ?? element.tooltipAlignment",
		"[_open]": "open ?? element._open"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComboButtonComponent {
	/**
	 * @deprecated the web component doesn't link its trigger to the menu by id.
	 */
	@Input() comboId?: string;
	/**
	 * The web component's default is `"lg"`.
	 */
	@Input() size?: "xs" | "sm" | "md" | "lg";
	@Input() label: string;
	@Input({ transform: booleanAttribute }) disabled?: boolean;
	/**
	 * The web component's default is `"top"` (v6: `"bottom"`).
	 */
	@Input() menuAlignment?: ComboButtonPlacement;
	/**
	 * Tooltip for the menu trigger.
	 */
	@Input() description: string;
	/**
	 * The web component's default is `"top"` (v6: `"bottom"`).
	 */
	@Input() tooltipPlacement?: string;
	/**
	 * @deprecated the web component positions its own tooltip.
	 */
	@Input({ transform: booleanAttribute }) tooltipAutoAlign = false;
	/**
	 * Whether the menu is open. Supports two-way binding with `openChange`.
	 */
	@Input({ transform: booleanAttribute }) open?: boolean;

	/**
	 * Emits when the primary action is clicked.
	 */
	@Output() actionClick = new EventEmitter<Event>();
	@Output() openChange = new EventEmitter<boolean>();

	protected elementRef = inject(ElementRef);
	protected element = this.elementRef.nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		// The web component calls `onClick` for the primary action (Angular can't bind `on*` properties).
		this.elementRef.nativeElement.onClick = (event: Event) => this.actionClick.emit(event);
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
