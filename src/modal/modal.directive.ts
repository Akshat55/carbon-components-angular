/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsModalDirective (+ slot helper directives)
 *
 * Sits directly on <cds-modal> — the web component replacement for the old
 * Angular Modal component. Structure the modal with the web component's
 * child elements (registered by ModalModule):
 *
 *   <cds-modal [open]="open" (close)="...">
 *     <cds-modal-header>
 *       <cds-modal-close-button></cds-modal-close-button>
 *       <cds-modal-label>Label</cds-modal-label>
 *       <cds-modal-heading>Heading</cds-modal-heading>
 *     </cds-modal-header>
 *     <cds-modal-body>...</cds-modal-body>
 *     <cds-modal-footer>
 *       <cds-modal-footer-button kind="secondary">Cancel</cds-modal-footer-button>
 *       <cds-modal-footer-button>Save</cds-modal-footer-button>
 *     </cds-modal-footer>
 *   </cds-modal>
 *
 * Backwards-compatible API surface:
 *   [open] [size]
 *   [theme]       → 'danger' maps to the alert attribute
 *   [isFullWidth] → full-width attribute
 *   [ariaLabel]   → aria-label attribute
 *   (close)       ← bridged from `cds-modal-closed`
 *   (overlaySelected) ← emitted when the close originated from the overlay
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	Output,
	OnChanges
} from "@angular/core";

@Directive({
	selector: "cds-modal, [cdsModal], [ibmModal]",
	standalone: true
})
export class CdsModalDirective implements OnChanges {
	/** Modal size. */
	@Input() size: "xs" | "sm" | "md" | "lg" = "md";

	/** 'danger' renders the alert/danger variant. */
	@Input() theme: "default" | "danger" = "default";

	/** Accessible label. */
	@Input() ariaLabel = "default";

	/** Full-width variant (no padding around the body). */
	@Input() isFullWidth = false;

	/** Whether the modal is open. */
	@Input() open = false;

	/** Emits when the modal is closed. */
	@Output() close = new EventEmitter();

	/** Emits when the modal is dismissed by clicking the overlay. */
	@Output() overlaySelected = new EventEmitter();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("size", this.size);
		el.setAttribute("aria-label", this.ariaLabel);

		this._setBoolAttr("alert", this.theme === "danger");
		this._setBoolAttr("full-width", this.isFullWidth);
		this._setBoolAttr("open", this.open);
	}

	@HostListener("cds-modal-closed", ["$event"])
	onClosed(event: CustomEvent): void {
		this.open = false;
		if (event.detail?.triggeredBy && (event.detail.triggeredBy as HTMLElement).matches?.(".cds--modal")) {
			this.overlaySelected.emit(event);
		}
		this.close.emit(event);
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}

/**
 * Preserves the old `cdsModalHeaderHeading` selector by mapping it onto a
 * <cds-modal-heading> parent-friendly slot assignment. Prefer using the
 * dedicated web component elements directly.
 */
@Directive({
	selector: "[cdsModalContent], [ibmModalContent]",
	standalone: true
})
export class CdsModalContentDirective { }
