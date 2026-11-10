import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output
} from "@angular/core";
import "@carbon/web-components/es/components/pagination-nav/index.js";
import { PaginationModel } from "../pagination-model.class";

export interface PaginationNavTranslations {
	NEXT: string;
	PREVIOUS: string;
}

/**
 * Wraps the `<cds-pagination-nav>` web component, driven by a `PaginationModel`
 * (`currentPage` starts at 1; `totalDataLength` is the number of pages).
 *
 * [See demo](../../?path=/story/components-pagination-nav--basic)
 */
@Component({
	selector: "cds-pagination-nav",
	template: "",
	host: {
		"[page]": "(model?.currentPage ?? 1) - 1",
		"[totalItems]": "model?.totalDataLength ?? 0",
		"[itemsShown]": "numOfItemsToShow",
		"[loop]": "loop",
		"[size]": "size",
		"[attr.disabled]": "disabled ? '' : null",
		"(cds-page-changed)": "onPageChanged($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PaginationNav {
	@Input() model: PaginationModel;
	@Input() disabled = false;
	/**
	 * Number of page buttons shown.
	 */
	@Input() numOfItemsToShow = 4;
	/**
	 * Wraps from the last page to the first.
	 */
	@Input() loop = false;
	@Input() size: "sm" | "md" | "lg" = "lg";
	/**
	 * @deprecated the web component provides its own labels.
	 */
	@Input() translations: PaginationNavTranslations;

	/**
	 * Emits the page number (starting at 1) the user picked.
	 */
	@Output() selectPage = new EventEmitter<number>();

	onPageChanged(event: Event) {
		this.selectPage.emit((event as CustomEvent<{ page: number }>).detail.page + 1);
	}
}
