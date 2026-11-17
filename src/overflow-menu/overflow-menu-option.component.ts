import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	ElementRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/overflow-menu/index.js";

/**
 * Possible link targets for `href` options.
 */
export enum Target {
	self = "_self",
	blank = "_blank",
	parent = "_parent",
	top = "_top"
}

/**
 * Adds Angular inputs and `(selected)` to the `<cds-overflow-menu-item>` web component.
 * Use inside `cds-overflow-menu`.
 */
@Component({
	selector: "cds-overflow-menu-item",
	template: "<ng-content />",
	host: {
		"[danger]": "type ? type === 'danger' : element.danger",
		"[disabled]": "disabled ?? element.disabled",
		"[divider]": "divider ?? element.divider",
		"[href]": "href ?? element.href",
		"[attr.target]": "target",
		"(click)": "onClick($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverflowMenuOption {
	@Input() type?: "normal" | "danger";
	@Input({ transform: booleanAttribute }) disabled?: boolean;
	/**
	 * Renders the option as a link.
	 */
	@Input() href: string;
	@Input() target: Target;
	/**
	 * Draws a divider above the option.
	 */
	@Input({ transform: booleanAttribute }) divider?: boolean;
	/**
	 * @deprecated the item's button is in the web component's shadow DOM.
	 */
	@Input() innerClass?: string;

	/**
	 * Emits when the option is chosen.
	 */
	@Output() selected: EventEmitter<any> = new EventEmitter();

	protected element = inject(ElementRef).nativeElement;

	onClick(event: Event) {
		if (!this.element.disabled) {
			this.selected.emit(event);
		}
	}
}
