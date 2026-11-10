/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsPopoverDirective
 *
 * Sits directly on <cds-popover> — the web component replacement for the old
 * `[cdsPopover]` container directive.
 *
 * Backwards-compatible API surface:
 *   [isOpen]        → open attribute, two-way via (isOpenChange)
 *   [align]         → align attribute
 *   [caret]         → caret attribute
 *   [dropShadow]    → dropShadow attribute
 *   [highContrast]  → highContrast attribute
 *   [autoAlign]     → autoalign attribute
 *   [alignmentAxisOffset] → alignment-axis-offset attribute
 *   (isOpenChange) (onOpen) (onClose) — preserved; fired when `isOpen` changes
 *
 * The popover body goes in <cds-popover-content>, same as before.
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges
} from "@angular/core";

@Directive({
	selector: "cds-popover, [cdsPopover], [ibmPopover]",
	standalone: true
})
export class CdsPopoverDirective implements OnChanges {
	/** Whether the popover is open. */
	@Input() isOpen = false;

	/** Popover alignment relative to the trigger. */
	@Input() align: string;

	/** Render the caret tip. */
	@Input() caret = true;

	/** Render a drop shadow. */
	@Input() dropShadow = true;

	/** High-contrast styling. */
	@Input() highContrast = false;

	/** Automatically re-align when there is not enough space. */
	@Input() autoAlign = false;

	/** Offset along the alignment axis, in px. */
	@Input() alignmentAxisOffset?: number;

	/** Emits the new open state whenever it changes. */
	@Output() isOpenChange = new EventEmitter<boolean>();

	/** Emits when the popover opens. */
	@Output() onOpen: EventEmitter<Event> = new EventEmitter();

	/** Emits when the popover closes. */
	@Output() onClose: EventEmitter<Event> = new EventEmitter();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(changes: SimpleChanges): void {
		const el = this._el.nativeElement;

		if (this.align) {
			el.setAttribute("align", this.align);
		}
		if (this.alignmentAxisOffset !== undefined && this.alignmentAxisOffset !== null) {
			el.setAttribute("alignment-axis-offset", String(this.alignmentAxisOffset));
		}

		this._setBoolAttr("open", this.isOpen);
		this._setBoolAttr("caret", this.caret);
		this._setBoolAttr("dropShadow", this.dropShadow);
		this._setBoolAttr("highContrast", this.highContrast);
		this._setBoolAttr("autoalign", this.autoAlign);

		if (changes["isOpen"] && !changes["isOpen"].firstChange) {
			this.isOpenChange.emit(this.isOpen);
			if (this.isOpen) {
				this.onOpen.emit();
			} else {
				this.onClose.emit();
			}
		}
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
