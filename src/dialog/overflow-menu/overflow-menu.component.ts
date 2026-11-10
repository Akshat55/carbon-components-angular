import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/overflow-menu/index.js";
import { BaseIconButton } from "carbon-components-angular/button";
import { I18n } from "carbon-components-angular/i18n";
import { FloatingMenuCleanup } from "carbon-components-angular/utils";

/**
 * Wraps the `<cds-overflow-menu>` web component. Project `cds-overflow-menu-option`s.
 *
 * ```html
 * <cds-overflow-menu description="Options">
 * 	<cds-overflow-menu-option (selected)="edit()">Edit</cds-overflow-menu-option>
 * 	<cds-overflow-menu-option type="danger">Delete</cds-overflow-menu-option>
 * </cds-overflow-menu>
 * ```
 *
 * For a menu opened from your own trigger, the `[cdsOverflowMenu]` directive is still available.
 *
 * [See demo](../../?path=/story/components-overflow-menu--basic)
 */
@Component({
	selector: "cds-overflow-menu",
	template: `
		@if (customTrigger) {
			<span slot="icon"><ng-template [ngTemplateOutlet]="customTrigger" /></span>
		}
		<span slot="tooltip-content">{{ description }}</span>
		<cds-overflow-menu-body [flipped]="flip" [direction]="placement.startsWith('top') ? 'top' : 'bottom'">
			<ng-content />
		</cds-overflow-menu-body>
	`,
	host: {
		"[open]": "open",
		"[flipped]": "flip",
		"[label]": "buttonLabel",
		"[align]": "align",
		"[autoalign]": "autoAlign",
		"[attr.aria-label]": "buttonLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, FloatingMenuCleanup],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverflowMenu extends BaseIconButton {
	public i18n = inject(I18n);

	@Input() buttonLabel = this.i18n.get().OVERFLOW_MENU.OVERFLOW;
	/**
	 * Tooltip text for the trigger.
	 */
	@Input() description = this.i18n.get().OVERFLOW_MENU.ICON_DESCRIPTION;
	/**
	 * Aligns the menu to the right edge of the trigger.
	 */
	@Input() flip = false;
	@Input() placement: "bottom" | "top" | "bottom,top" | "top,bottom" = "bottom";
	/**
	 * Supports two-way binding with `openChange`.
	 */
	@Input() open = false;
	/**
	 * Replaces the trigger icon.
	 */
	@Input() customTrigger: TemplateRef<any>;
	/**
	 * @deprecated the web component positions its own menu.
	 */
	@Input() offset: { x: number, y: number };
	/**
	 * @deprecated
	 */
	@Input() wrapperClass = "";
	/**
	 * @deprecated
	 */
	@Input() triggerClass = "";

	@Output() openChange = new EventEmitter<boolean>();

	constructor() {
		super();
		// The web component reflects `open`; mirror it for `openChange`.
		const element: HTMLElement = inject(ElementRef).nativeElement;
		const changeDetectorRef = inject(ChangeDetectorRef);
		const observer = new MutationObserver(() => {
			const open = element.hasAttribute("open");
			if (open !== this.open) {
				this.open = open;
				this.openChange.emit(open);
				changeDetectorRef.markForCheck();
			}
		});
		observer.observe(element, { attributes: true, attributeFilter: ["open"] });
		inject(DestroyRef).onDestroy(() => observer.disconnect());
	}
}
