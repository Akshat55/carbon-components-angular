import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/popover/index.js";

/**
 * Shared inputs/outputs of the popover based wrappers (`cds-popover`, `cds-tooltip`, `cds-toggletip`).
 * `isOpen` / `isOpenChange` follow the web component's reflected `open` attribute.
 */
@Directive({
	host: {
		"[align]": "align",
		"[autoalign]": "autoAlign",
		"[open]": "isOpen"
	}
})
export abstract class PopoverBase {
	/**
	 * Placement, e.g. `top`, `bottom-start` (v6 names such as `top-left` also work).
	 */
	@Input() align = "bottom";
	@Input() autoAlign = false;
	@Input() isOpen = false;

	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() onClose: EventEmitter<Event> = new EventEmitter();
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() onOpen: EventEmitter<Event> = new EventEmitter();
	@Output() isOpenChange = new EventEmitter<boolean>();

	protected elementRef = inject(ElementRef);
	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		const element: HTMLElement = this.elementRef.nativeElement;
		const observer = new MutationObserver(() => {
			const open = element.hasAttribute("open");
			if (open !== this.isOpen) {
				this.isOpen = open;
				this.isOpenChange.emit(open);
				(open ? this.onOpen : this.onClose).emit();
				this.changeDetectorRef.markForCheck();
			}
		});
		observer.observe(element, { attributes: true, attributeFilter: ["open"] });
		inject(DestroyRef).onDestroy(() => observer.disconnect());
	}
}

/**
 * Wraps the `<cds-popover>` web component. Put the trigger in the default slot and the
 * content in a `cds-popover-content`.
 *
 * ```html
 * <cds-popover [isOpen]="open" align="bottom-start">
 * 	<button (click)="open = !open">Toggle</button>
 * 	<cds-popover-content>Content</cds-popover-content>
 * </cds-popover>
 * ```
 *
 * The v6 `[cdsPopover]` attribute on other elements is no longer supported: the
 * `cds-popover-content` web component needs a `cds-popover` parent.
 *
 * [See demo](../../?path=/story/components-popover--basic)
 */
@Component({
	selector: "cds-popover",
	template: "<ng-content />",
	host: {
		"[caret]": "caret",
		"[dropShadow]": "dropShadow",
		"[highContrast]": "highContrast",
		"[border]": "border",
		"[tabTip]": "tabTip",
		"[alignmentAxisOffset]": "alignmentAxisOffset"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PopoverContainer extends PopoverBase {
	@Input() caret = true;
	@Input() dropShadow = true;
	@Input() highContrast = false;
	@Input() border = false;
	@Input() tabTip = false;
	@Input() alignmentAxisOffset?: number;
}
