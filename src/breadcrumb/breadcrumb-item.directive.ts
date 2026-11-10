/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsBreadcrumbItemDirective
 *
 * Sits directly on <cds-breadcrumb-item>.
 *
 * The web component expects link items to contain a <cds-breadcrumb-link>.
 * To preserve the old carbon-components-angular API — where `[href]` and
 * `[current]` lived on the item — this directive lazily wraps the projected
 * content in a <cds-breadcrumb-link> when `[href]` is provided.
 *
 * Backwards-compatible API surface:
 *   [href]        → href on the generated <cds-breadcrumb-link>
 *   [current]     → aria-current="page" on the link
 *   [ariaCurrent] → value used when current is true (default "page")
 */
import {
	AfterContentInit,
	Directive,
	ElementRef,
	Input,
	OnChanges
} from "@angular/core";

@Directive({
	selector: "cds-breadcrumb-item, [cdsBreadcrumbItem], [ibmBreadcrumbItem]",
	standalone: true
})
export class CdsBreadcrumbItemDirective implements OnChanges, AfterContentInit {
	/** Link destination. When set, content is wrapped in a <cds-breadcrumb-link>. */
	@Input() href: string;

	/** Marks this item as the current page. */
	@Input() current = false;

	/** aria-current value applied when `current` is true. */
	@Input() ariaCurrent = "page";

	private _link: HTMLElement | null = null;
	private _contentReady = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngAfterContentInit(): void {
		this._contentReady = true;
		this._sync();
	}

	ngOnChanges(): void {
		if (this._contentReady) {
			this._sync();
		}
	}

	private _sync(): void {
		const el = this._el.nativeElement;

		// Only wrap when an href is provided and content isn't already a link.
		if (this.href && !this._link && !el.querySelector("cds-breadcrumb-link")) {
			const link = document.createElement("cds-breadcrumb-link");
			while (el.firstChild) {
				link.appendChild(el.firstChild);
			}
			el.appendChild(link);
			this._link = link;
		}

		const link = this._link ?? (el.querySelector("cds-breadcrumb-link") as HTMLElement | null);
		if (link) {
			if (this.href) {
				link.setAttribute("href", this.href);
			}
			if (this.current) {
				link.setAttribute("aria-current", this.ariaCurrent);
			} else {
				link.removeAttribute("aria-current");
			}
		}
	}
}
