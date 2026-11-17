import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/menu/index.js";
import { IconDirective } from "carbon-components-angular/icon";
import { ItemClickEvent } from "./context-menu.types";

/**
 * Adds Angular inputs and outputs to the `<cds-menu-item>` web component. Give it a submenu
 * with a child `<cds-menu slot="submenu">`.
 */
@Component({
	selector: "cds-menu-item",
	template: `
		@if (icon) {
			<svg [cdsIcon]="icon" size="16" slot="render-icon"></svg>
		}
		<ng-content />
	`,
	host: {
		"[label]": "label ?? element.label",
		"[shortcut]": "info ?? element.shortcut",
		"[disabled]": "disabled ?? element.disabled",
		"[kind]": "danger ? 'danger' : (kind ?? element.kind)",
		"[dangerDescription]": "dangerDescription ?? element.dangerDescription",
		"(click)": "handleClick($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IconDirective],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContextMenuItemComponent {
	@Input() label?: string;
	/**
	 * Secondary text, e.g. a keyboard shortcut.
	 */
	@Input() info?: string;
	/**
	 * Icon name for `cdsIcon`.
	 */
	@Input() icon = "";
	/**
	 * Passed on in `itemClick`.
	 */
	@Input() value = "";
	@Input({ transform: booleanAttribute }) disabled?: boolean;
	/**
	 * The web component's default is `"default"`.
	 */
	@Input() kind?: "default" | "danger";
	/**
	 * @deprecated use `kind="danger"`.
	 */
	@Input({ transform: booleanAttribute }) danger?: boolean;
	@Input() dangerDescription?: string;

	@Output() itemClick = new EventEmitter<ItemClickEvent>();

	protected element: any = inject(ElementRef).nativeElement;

	/**
	 * The web component turns Enter / Space into a click.
	 */
	handleClick(event: MouseEvent & KeyboardEvent) {
		if (this.element.disabled || this.element.querySelector(":scope > [slot=submenu]") || event.target !== event.currentTarget) {
			return;
		}
		this.itemClick.emit({ event, label: this.label, info: this.info, value: this.value });
	}
}
