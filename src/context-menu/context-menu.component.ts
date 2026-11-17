import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/menu/index.js";

/**
 * Adds Angular inputs and outputs to the `<cds-menu>` web component, used as a context menu or a submenu.
 *
 * ```html
 * <cds-menu [open]="open" [position]="{ left: x, top: y }">
 * 	<cds-menu-item label="Copy" (itemClick)="copy()" />
 * 	<cds-menu-item-divider />
 * 	<cds-menu-item label="Delete" kind="danger" />
 * </cds-menu>
 * ```
 *
 * [See demo](../../?path=/story/components-context-menu--basic)
 */
@Component({
	selector: "cds-menu",
	template: "<ng-content />",
	host: {
		"[open]": "open ?? element.open",
		"[x]": "position?.left ?? element.x",
		"[y]": "position?.top ?? element.y",
		"[size]": "size ?? element.size"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContextMenuComponent {
	/**
	 * Unset, the menu keeps its own state (a `cds-menu-button` or `cds-combo-button` opens it).
	 */
	@Input({ transform: booleanAttribute }) open?: boolean;
	/**
	 * Viewport position, in pixels.
	 */
	@Input() position?: { left: number, top: number };
	/**
	 * The web component's default is `"sm"`; a `cds-menu-button` or `cds-combo-button`
	 * gives its menu the button's size.
	 */
	@Input() size?: "xs" | "sm" | "md" | "lg";

	elementRef = inject(ElementRef);
	protected element = this.elementRef.nativeElement;

	focusMenu() {
		this.elementRef.nativeElement.focus();
	}
}
