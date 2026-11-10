import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/menu/index.js";

/**
 * Wraps the `<cds-menu>` web component, used as a context menu or a submenu.
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
		"[open]": "open",
		"[x]": "position.left",
		"[y]": "position.top",
		"[size]": "size"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContextMenuComponent {
	@Input() open = false;
	/**
	 * Viewport position, in pixels.
	 */
	@Input() position = { left: 0, top: 0 };
	@Input() size: "xs" | "sm" | "md" | "lg" = "lg";

	elementRef = inject(ElementRef);

	focusMenu() {
		this.elementRef.nativeElement.focus();
	}
}
