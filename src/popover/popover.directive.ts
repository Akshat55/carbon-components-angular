import {
	booleanAttribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/popover/index.js";
import { observeAttributes } from "carbon-components-angular/utils";

/**
 * Shared inputs/outputs of the popover based wrappers (`cds-popover`, `cds-tooltip`, `cds-toggletip`).
 * `isOpen` / `isOpenChange` follow the web component's reflected `open` attribute.
 */
@Directive({
	host: {
		"[autoalign]": "autoAlign ?? element.autoalign",
		"[open]": "isOpen ?? element.open"
	}
})
export abstract class PopoverBase {
	/**
	 * Placement, e.g. `top`, `bottom-start` (v6 names such as `top-left` also work).
	 * Each wrapper binds it to its web component's alignment property.
	 */
	@Input() align?: string;
	@Input({ transform: booleanAttribute }) autoAlign?: boolean;
	/**
	 * Supports two-way binding with `isOpenChange`. Unset, the web component keeps its own state.
	 */
	@Input({ transform: booleanAttribute }) isOpen?: boolean;

	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() onClose: EventEmitter<Event> = new EventEmitter();
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() onOpen: EventEmitter<Event> = new EventEmitter();
	@Output() isOpenChange = new EventEmitter<boolean>();

	protected elementRef = inject(ElementRef);
	protected element = this.elementRef.nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		observeAttributes(this.element, ["open"], () => {
			const open = this.element.open;
			if (open !== !!this.isOpen) {
				this.isOpen = open;
				this.isOpenChange.emit(open);
				(open ? this.onOpen : this.onClose).emit();
				this.changeDetectorRef.markForCheck();
			}
		});
	}
}

/**
 * Adds Angular inputs and outputs to the `<cds-popover>` web component. Put the trigger in the default slot and the
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
		"[align]": "align ?? element.align",
		"[caret]": "caret ?? element.caret",
		"[dropShadow]": "dropShadow ?? element.dropShadow",
		"[highContrast]": "highContrast ?? element.highContrast",
		"[border]": "border ?? element.border",
		"[tabTip]": "tabTip ?? element.tabTip",
		"[alignmentAxisOffset]": "alignmentAxisOffset ?? element.alignmentAxisOffset"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PopoverContainer extends PopoverBase {
	/**
	 * The web component's default is `true`.
	 */
	@Input({ transform: booleanAttribute }) caret?: boolean;
	/**
	 * The web component's default is `true`.
	 */
	@Input({ transform: booleanAttribute }) dropShadow?: boolean;
	@Input({ transform: booleanAttribute }) highContrast?: boolean;
	@Input({ transform: booleanAttribute }) border?: boolean;
	@Input({ transform: booleanAttribute }) tabTip?: boolean;
	@Input() alignmentAxisOffset?: number;
}
