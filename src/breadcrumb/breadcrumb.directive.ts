/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsBreadcrumbDirective
 *
 * Sits directly on <cds-breadcrumb> — no wrapper element, no extra DOM node.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [noTrailingSlash] → no-trailing-slash attribute
 *   [ariaLabel]       → aria-label attribute
 *   [items]           → renders <cds-breadcrumb-item> children from the array,
 *                       matching the old template-less usage
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges,
	SimpleChanges
} from "@angular/core";
import { BreadcrumbItem } from "./breadcrumb-item.interface";

@Directive({
	selector: "cds-breadcrumb, [cdsBreadcrumb], [ibmBreadcrumb]",
	standalone: true
})
export class CdsBreadcrumbDirective implements OnChanges {
	/** Optional array of items — rendered as breadcrumb children. */
	@Input() items: Array<BreadcrumbItem>;

	/** Set to `true` to omit the trailing slash after the last item. */
	@Input() noTrailingSlash = false;

	/** Accessible label for the breadcrumb nav. */
	@Input() ariaLabel = "Breadcrumb";

	private _generated: HTMLElement[] = [];

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(changes: SimpleChanges): void {
		const el = this._el.nativeElement;

		el.setAttribute("aria-label", this.ariaLabel);

		if (this.noTrailingSlash) {
			el.setAttribute("no-trailing-slash", "");
		} else {
			el.removeAttribute("no-trailing-slash");
		}

		if (changes["items"]) {
			this._renderItems();
		}
	}

	/**
	 * Renders `[items]` as <cds-breadcrumb-item>/<cds-breadcrumb-link>
	 * children, preserving the old array-driven API.
	 */
	private _renderItems(): void {
		const el = this._el.nativeElement;

		this._generated.forEach((node) => node.remove());
		this._generated = [];

		if (!this.items) {
			return;
		}

		for (const item of this.items) {
			const itemEl = document.createElement("cds-breadcrumb-item");
			const linkEl = document.createElement("cds-breadcrumb-link");

			if (item.href) {
				linkEl.setAttribute("href", item.href);
			}
			if ((item as any).current) {
				linkEl.setAttribute("aria-current", (item as any).ariaCurrent || "page");
			}
			linkEl.textContent = typeof item.content === "string" ? item.content : "";

			itemEl.appendChild(linkEl);
			el.appendChild(itemEl);
			this._generated.push(itemEl);
		}
	}
}
