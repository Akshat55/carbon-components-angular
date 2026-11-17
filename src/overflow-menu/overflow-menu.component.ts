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
	TemplateRef,
	inject
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/overflow-menu/index.js";
import { I18n } from "carbon-components-angular/i18n";
import { IconDirective } from "carbon-components-angular/icon";
import { observeAttributes } from "carbon-components-angular/utils";

/**
 * Adds Angular inputs and `[(open)]` to the `<cds-overflow-menu>` web component.
 * Put its items in a `cds-overflow-menu-body` (set its `direction` to open the menu above the trigger).
 *
 * ```html
 * <cds-overflow-menu description="Options">
 * 	<cds-overflow-menu-body>
 * 		<cds-overflow-menu-item (selected)="edit()">Edit</cds-overflow-menu-item>
 * 		<cds-overflow-menu-item type="danger">Delete</cds-overflow-menu-item>
 * 	</cds-overflow-menu-body>
 * </cds-overflow-menu>
 * ```
 *
 * For custom content (e.g. a list of filter checkboxes) use `cds-popover` instead.
 *
 * [See demo](../../?path=/story/components-overflow-menu--basic)
 */
@Component({
	selector: "cds-overflow-menu",
	template: `
		<!-- The web component draws no icon of its own, only what is in its icon slot. -->
		@if (customTrigger) {
			<span slot="icon"><ng-template [ngTemplateOutlet]="customTrigger" /></span>
		} @else {
			<svg cdsIcon="overflow-menu--vertical" size="16" class="cds--overflow-menu__icon" slot="icon"></svg>
		}
		<span slot="tooltip-content">{{ description }}</span>
		<ng-content />
	`,
	host: {
		"[open]": "open ?? element.open",
		"[flipped]": "flip ?? element.flipped",
		"[label]": "buttonLabel",
		"[align]": "align ?? element.align",
		"[autoalign]": "autoAlign ?? element.autoalign",
		"[size]": "size ?? element.size",
		"[disabled]": "disabled ?? element.disabled",
		"[attr.aria-label]": "buttonLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, IconDirective],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverflowMenu {
	public i18n = inject(I18n);

	@Input() buttonLabel = this.i18n.get().OVERFLOW_MENU.OVERFLOW;
	/**
	 * Tooltip text for the trigger.
	 */
	@Input() description = this.i18n.get().OVERFLOW_MENU.ICON_DESCRIPTION;
	/**
	 * Aligns the menu to the right edge of the trigger.
	 */
	@Input({ transform: booleanAttribute }) flip?: boolean;
	/**
	 * Supports two-way binding with `openChange`. Unset, the web component keeps its own state.
	 */
	@Input({ transform: booleanAttribute }) open?: boolean;
	/**
	 * Replaces the trigger icon.
	 */
	@Input() customTrigger: TemplateRef<any>;
	/**
	 * Position of the trigger's tooltip.
	 */
	@Input() align?: "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" |
		"left" | "left-start" | "left-end" | "right" | "right-start" | "right-end";
	/**
	 * Repositions the tooltip when it would be cut off.
	 */
	@Input({ transform: booleanAttribute }) autoAlign?: boolean;
	@Input() size?: "xs" | "sm" | "md" | "lg";
	@Input({ transform: booleanAttribute }) disabled?: boolean;

	@Output() openChange = new EventEmitter<boolean>();

	protected element = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		// The web component reflects `open`; mirror it for `openChange`.
		observeAttributes(this.element, ["open"], () => {
			const open = this.element.open;
			if (open !== !!this.open) {
				this.open = open;
				this.openChange.emit(open);
				this.changeDetectorRef.markForCheck();
			}
		});
	}
}
