/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsDismissibleTagDirective
 *
 * Sits directly on <cds-dismissible-tag> — the web component replacement for
 * the old Angular `TagFilter` component (<cds-tag-filter>).
 *
 * Backwards-compatible API surface (matches carbon-components-angular TagFilter):
 *   [type]             → type attribute
 *   [size]             → size attribute
 *   [disabled]         → disabled attribute
 *   [title]            → tag-title attribute
 *   [closeButtonLabel] → dismiss-tooltip-label attribute
 *   (close)            ← re-emitted from the `cds-dismissible-tag-closed` event
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	Output
} from "@angular/core";
import { TagType } from "./tag.directive";

@Directive({
	selector: "cds-dismissible-tag, [cdsTagFilter], [ibmTagFilter]",
	standalone: true
})
export class CdsDismissibleTagDirective implements OnChanges {
	/** Type of the tag — determines the styling. */
	@Input() type: TagType = "gray";

	/** Tag render size. */
	@Input() size: "sm" | "md" | "lg" = "md";

	/** Set to `true` to disable the tag (close button becomes inert). */
	@Input() disabled = false;

	/** Title for the tag — maps to the `tag-title` attribute. */
	@Input() title: string;

	/** Label for the close button tooltip. */
	@Input() closeButtonLabel = "Clear Filter";

	/** Emits when the tag is dismissed via its close button. */
	@Output() close = new EventEmitter<any>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;
		el.setAttribute("type", this.type);
		el.setAttribute("size", this.size);
		if (this.title) {
			el.setAttribute("tag-title", this.title);
		}
		if (this.closeButtonLabel) {
			el.setAttribute("dismiss-tooltip-label", this.closeButtonLabel);
		}
		if (this.disabled) {
			el.setAttribute("disabled", "");
		} else {
			el.removeAttribute("disabled");
		}
	}

	/** Bridge the web component's close event → Angular `(close)` output. */
	@HostListener("cds-dismissible-tag-closed", ["$event"])
	onClosed(event: CustomEvent): void {
		this.close.emit(event);
	}
}
