import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import merge from "lodash-es/merge";
import "@carbon/web-components/es/components/pagination/index.js";
import "@carbon/web-components/es/components/select/index.js";
import { I18n } from "carbon-components-angular/i18n";
import { PaginationModel } from "./pagination-model.class";

export interface PaginationTranslations {
	ITEMS_PER_PAGE: string;
	OPEN_LIST_OF_OPTIONS: string;
	BACKWARD: string;
	FORWARD: string;
	TOTAL_ITEMS_UNKNOWN: string;
	TOTAL_ITEMS: string;
	TOTAL_ITEM: string;
	OF_LAST_PAGES: string;
	OF_LAST_PAGE: string;
}

/**
 * Wraps the `<cds-pagination>` web component, driven by a `PaginationModel`.
 * `selectPage` emits the page the user picked; update `model.currentPage` in response.
 *
 * ```html
 * <cds-pagination [model]="model" (selectPage)="model.currentPage = $event" />
 * ```
 *
 * [See demo](../../?path=/story/components-pagination--basic)
 */
@Component({
	selector: "cds-pagination",
	template: `
		@for (option of itemsPerPageOptions; track option) {
			<cds-select-item [value]="'' + option">{{ option }}</cds-select-item>
		}
	`,
	host: {
		"[page]": "model?.currentPage ?? 1",
		"[pageSize]": "model?.pageLength ?? 10",
		"[totalItems]": "model?.totalDataLength ?? 0",
		"[size]": "size",
		"[disabled]": "disabled",
		"[pageInputDisabled]": "pageInputDisabled || !showPageInput",
		"[pagesUnknown]": "pagesUnknown",
		"[itemsPerPageText]": "texts.ITEMS_PER_PAGE",
		"[backwardText]": "texts.BACKWARD",
		"[forwardText]": "texts.FORWARD",
		"(cds-pagination-changed-current)": "onPageChanged($event)",
		"(cds-page-sizes-select-changed)": "onPageSizeChanged($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Pagination {
	public i18n = inject(I18n);

	@Input() model: PaginationModel;
	@Input() disabled = false;
	@Input() pageInputDisabled = false;
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() showPageInput = true;
	@Input() pagesUnknown = false;
	@Input() itemsPerPageOptions: number[] = [10, 20, 30, 40, 50];
	@Input() set translations(value: PaginationTranslations) {
		this.texts = merge(this.i18n.getMultiple("PAGINATION"), value);
	}
	/**
	 * @deprecated the web component renders its own page select.
	 */
	@Input() pageSelectThreshold = 1000;
	/**
	 * @deprecated the web component works out when the buttons are disabled.
	 */
	@Input() backwardDisabled = false;
	/**
	 * @deprecated the web component works out when the buttons are disabled.
	 */
	@Input() forwardDisabled = false;
	/**
	 * @deprecated use `<cds-pagination-skeleton>` instead.
	 */
	@Input() skeleton = false;

	/**
	 * Emits the page number (starting at 1) the user picked.
	 */
	@Output() selectPage = new EventEmitter<number>();

	protected texts: PaginationTranslations = this.i18n.get().PAGINATION;

	onPageChanged(event: Event) {
		this.selectPage.emit((event as CustomEvent<{ page: number }>).detail.page);
	}

	onPageSizeChanged(event: Event) {
		if (this.model) {
			this.model.pageLength = (event as CustomEvent<{ pageSize: number }>).detail.pageSize;
		}
		this.selectPage.emit(1);
	}
}
