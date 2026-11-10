import {
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
 * Wraps the `<cds-combo-button>` web component: a primary action plus a menu of
 * `cds-menu-item`s. `actionClick` emits for the primary action.
 *
 * [See demo](../../?path=/story/components-combo-button--basic)
 */
@Component({
	selector: "cds-combo-button",
	template: `
		<cds-menu [id]="comboId" [size]="size">
			<ng-content />
		</cds-menu>
	`,
	host: {
		"[label]": "label",
		"[size]": "size",
		"[disabled]": "disabled",
		"[menuAlignment]": "menuAlignment",
		"[tooltipContent]": "description",
		"[tooltipAlignment]": "tooltipPlacement",
		"[_open]": "open"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComboButtonComponent {
	static comboButtonCounter = 0;

	@Input() comboId = `combo-button-${ComboButtonComponent.comboButtonCounter++}`;
	@Input() size: "xs" | "sm" | "md" | "lg" = "lg";
	@Input() label: string;
	@Input() disabled = false;
	@Input() menuAlignment: ComboButtonPlacement = "bottom";
	/**
	 * Tooltip for the menu trigger.
	 */
	@Input() description: string;
	@Input() tooltipPlacement = "bottom";
	/**
	 * @deprecated the web component positions its own tooltip.
	 */
	@Input() tooltipAutoAlign = false;
	/**
	 * Whether the menu is open. Kept in sync when the user opens or closes it.
	 */
	@Input() open = false;

	/**
	 * Emits when the primary action is clicked.
	 */
	@Output() actionClick = new EventEmitter<Event>();

	protected elementRef = inject(ElementRef);
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
			if (element._open !== this.open) {
				this.open = element._open;
				this.changeDetectorRef.markForCheck();
			}
		});
	}

}
