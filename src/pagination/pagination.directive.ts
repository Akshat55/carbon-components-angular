/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsPaginationDirective
 *
 * Sits directly on <cds-pagination> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `Pagination` component
 * @Inputs/@Outputs to web component attributes/events.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [model]               → PaginationModel {currentPage, pageLength, totalDataLength}
 *   [disabled] [pageInputDisabled] [pagesUnknown] [size]
 *   [itemsPerPageOptions] → rendered as <cds-select-item> children
 *   (selectPage)          ← bridged from `cds-pagination-changed-current`
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	Output,
	SimpleChanges
} from "@angular/core";
import { PaginationModel } from "./pagination-model.class";

@Directive({
	selector: "cds-pagination, [cdsPagination], [ibmPagination]",
	standalone: true
})
export class CdsPaginationDirective implements OnChanges {
	/** Pagination state — same `PaginationModel` class as before. */
	@Input() model: PaginationModel;

	/** Set to `true` to disable the pagination controls. */
	@Input() disabled = false;

	/** Set to `true` to disable the page input. */
	@Input() pageInputDisabled = false;

	/** Set to `true` when the total number of items is unknown. */
	@Input() pagesUnknown = false;

	/** Size of the pagination bar. */
	@Input() size: "sm" | "md" | "lg" = "md";

	/** Options for the items-per-page select. */
	@Input() itemsPerPageOptions: number[] = [10, 20, 30, 40, 50];

	/** Emits the newly selected page number. */
	@Output() selectPage = new EventEmitter<number>();

	private _generatedOptions: HTMLElement[] = [];

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(changes: SimpleChanges): void {
		const el = this._el.nativeElement;

		if (this.model) {
			el.setAttribute("page", String(this.model.currentPage ?? 1));
			el.setAttribute("page-size", String(this.model.pageLength ?? 10));
			if (this.model.totalDataLength !== undefined && this.model.totalDataLength !== null) {
				el.setAttribute("total-items", String(this.model.totalDataLength));
			}
		}

		el.setAttribute("size", this.size);

		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("page-input-disabled", this.pageInputDisabled);
		this._setBoolAttr("pages-unknown", this.pagesUnknown);

		if (changes["itemsPerPageOptions"]) {
			this._renderPageSizeOptions();
		}
	}

	/** Bridge the web component's page change event → `(selectPage)`. */
	@HostListener("cds-pagination-changed-current", ["$event"])
	onPageChanged(event: CustomEvent): void {
		const page = event.detail?.page;
		if (this.model) {
			this.model.currentPage = page;
		}
		this.selectPage.emit(page);
	}

	/** Keep the model's page length in sync with the page-size select. */
	@HostListener("cds-select-selected", ["$event"])
	onPageSizeChanged(event: CustomEvent): void {
		const value = Number(event.detail?.value);
		if (this.model && !Number.isNaN(value)) {
			this.model.pageLength = value;
		}
	}

	private _renderPageSizeOptions(): void {
		const el = this._el.nativeElement;

		this._generatedOptions.forEach((node) => node.remove());
		this._generatedOptions = [];

		for (const option of this.itemsPerPageOptions ?? []) {
			const item = document.createElement("cds-select-item");
			item.setAttribute("value", String(option));
			item.textContent = String(option);
			el.appendChild(item);
			this._generatedOptions.push(item);
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
