import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	TemplateRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/modal/index.js";
import { PLACEHOLDER_SERVICE_PROVIDER } from "carbon-components-angular/placeholder";
import { BaseModalService } from "./base-modal.service";

/**
 * Wraps the `<cds-modal>` web component. Angular controls `open`: the modal emits `close`
 * (Escape), `overlaySelected` (click outside) and the header emits `closeSelect`, and you
 * set `open` to `false` (or call `closeModal()` in a `BaseModal` created by `ModalService`).
 *
 * ```html
 * <cds-modal [open]="open" (overlaySelected)="open = false">
 * 	<cds-modal-header (closeSelect)="open = false">
 * 		<h2 cdsModalHeaderLabel>Label</h2>
 * 		<h3 cdsModalHeaderHeading>Heading</h3>
 * 	</cds-modal-header>
 * 	<section cdsModalContent>Content</section>
 * 	<cds-modal-footer><cds-button (click)="open = false">Done</cds-button></cds-modal-footer>
 * </cds-modal>
 * ```
 *
 * [See demo](../../?path=/story/components-modal--basic)
 */
@Component({
	selector: "cds-modal",
	template: `<ng-content />`,
	host: {
		"[open]": "open",
		"[size]": "size",
		"[alert]": "theme === 'danger'",
		"[fullWidth]": "isFullWidth",
		"[hasScrollingContent]": "!!hasScrollingContent",
		"[ariaLabel]": "ariaLabel",
		"(keydown.escape)": "onEscape($event)",
		"(cds-modal-beingclosed)": "onBeingClosed($event)"
	},
	providers: [PLACEHOLDER_SERVICE_PROVIDER, BaseModalService],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Modal implements AfterViewInit, OnChanges {
	modalService = inject(BaseModalService);

	@Input() size: "xs" | "sm" | "md" | "lg" = "md";
	@Input() theme: "default" | "danger" = "default";
	@Input() ariaLabel = "default";
	@Input() isFullWidth = false;
	@Input() open = false;
	/**
	 * Element to focus when the modal closes.
	 */
	@Input() trigger: HTMLElement;
	@Input() hasScrollingContent: boolean = null;
	/**
	 * Selector of the element to focus when the modal opens.
	 */
	@Input() selectorPrimaryFocus = "[modal-primary-focus]";
	/**
	 * @deprecated pass the decorator to `cds-modal-header`.
	 */
	@Input() decorator: TemplateRef<any>;

	/**
	 * Emits when the user clicks outside the modal.
	 */
	@Output() overlaySelected = new EventEmitter();
	/**
	 * Emits when the user presses Escape.
	 */
	@Output() close = new EventEmitter();

	private element: HTMLElement = inject(ElementRef).nativeElement;

	ngOnChanges({ open }: SimpleChanges) {
		if (open && !open.firstChange) {
			if (open.currentValue) {
				setTimeout(() => this.focusInitialElement(), 100);
			} else {
				this.trigger?.focus();
			}
		}
	}

	ngAfterViewInit() {
		if (this.open) {
			this.focusInitialElement();
		}
	}

	onEscape(event: Event) {
		if (!this.open) {
			return;
		}
		// Prevents other open modals from handling the same Escape.
		event.stopImmediatePropagation();
		this.open = false;
		this.close.emit();
		this.modalService.destroy();
	}

	/**
	 * Angular owns `open`, so stop the web component closing itself and emit the v6 output instead.
	 */
	onBeingClosed(event: Event) {
		event.preventDefault();
		const triggeredBy = (event as CustomEvent<{ triggeredBy: Element }>).detail?.triggeredBy;
		if (triggeredBy?.closest?.("cds-modal-close-button")) {
			// `cds-modal-header` emits `closeSelect`.
			return;
		}
		if (this.open) {
			this.overlaySelected.emit();
		}
	}

	protected focusInitialElement() {
		const primary = this.element.querySelector<HTMLElement>(this.selectorPrimaryFocus);
		primary?.focus();
	}
}
