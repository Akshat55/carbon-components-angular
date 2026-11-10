import {
	ChangeDetectionStrategy,
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
		"[tooltipAlignment]": "tooltipPlacement"
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
	 * @deprecated the web component opens and closes its own menu.
	 */
	@Input() open = false;

	/**
	 * Emits when the primary action is clicked.
	 */
	@Output() actionClick = new EventEmitter<Event>();

	constructor() {
		// The web component calls `onClick` for the primary action (Angular can't bind `on*` properties).
		inject(ElementRef).nativeElement.onClick = (event: Event) => this.actionClick.emit(event);
	}
}
