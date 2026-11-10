import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/pagination-nav/index.js";
import { I18n } from "carbon-components-angular/i18n";
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
		"[translateWithId]": "translateWithId",
		// The web component has no disabled state; block interaction instead.
		"[inert]": "disabled",
		"[attr.aria-disabled]": "disabled || null",
		"(cds-page-changed)": "onPageChanged($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PaginationNav {
	public i18n = inject(I18n);

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
	 * Labels for the previous / next buttons. Defaults to the `PAGINATION` i18n values.
	 */
	@Input() set translations(value: PaginationNavTranslations) {
		this.texts = { ...this.texts, ...value };
		const { NEXT, PREVIOUS } = this.texts;
		const labels = {
			"carbon.pagination-nav.next": NEXT,
			"carbon.pagination-nav.previous": PREVIOUS,
			"carbon.pagination-nav.item": "Page",
			"carbon.pagination-nav.active": "Active",
			"carbon.pagination-nav.of": "of"
		};
		this.translateWithId = (id: string) => labels[id];
	}

	/**
	 * Emits the page number (starting at 1) the user picked.
	 */
	@Output() selectPage = new EventEmitter<number>();

	protected texts: PaginationNavTranslations = {
		NEXT: this.i18n.get().PAGINATION.NEXT,
		PREVIOUS: this.i18n.get().PAGINATION.PREVIOUS
	};
	protected translateWithId: (id: string) => string;

	constructor() {
		this.translations = {} as PaginationNavTranslations;
	}

	get currentPage() {
		return this.model.currentPage;
	}
	/**
	 * Emits `selectPage`; update the model's `currentPage` in the handler.
	 */
	set currentPage(value) {
		this.selectPage.emit(Number(value));
	}

	get totalDataLength() {
		return this.model.totalDataLength;
	}

	get leftArrowDisabled() {
		return this.disabled || (!this.loop && this.currentPage === 1);
	}

	get rightArrowDisabled() {
		return this.disabled || (!this.loop && this.currentPage === this.totalDataLength);
	}

	jumpToNext() {
		if (this.currentPage < this.totalDataLength) {
			this.currentPage = this.currentPage + 1;
		} else {
			this.currentPage = this.loop ? 1 : this.totalDataLength;
		}
	}

	jumpToPrevious() {
		if (this.currentPage > 1) {
			this.currentPage = this.currentPage - 1;
		} else {
			this.currentPage = this.loop ? this.totalDataLength : 1;
		}
	}

	onPageChanged(event: Event) {
		this.selectPage.emit((event as CustomEvent<{ page: number }>).detail.page + 1);
	}
}
