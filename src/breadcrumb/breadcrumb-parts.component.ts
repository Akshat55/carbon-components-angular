import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/breadcrumb/index.js";
// Not registered by the breadcrumb index.
import "@carbon/web-components/es/components/breadcrumb/breadcrumb-overflow-menu.js";

/**
 * The link of a `cds-breadcrumb-item`.
 *
 * Adds Angular inputs to the `<cds-breadcrumb-link>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-breadcrumb-link",
	template: "<ng-content />",
	host: {
		"[href]": "href ?? element.href",
		"[isCurrentPage]": "isCurrentPage ?? element.isCurrentPage",
		"[ariaCurrent]": "ariaCurrent ?? element.ariaCurrent",
		"[target]": "target ?? element.target",
		"[rel]": "rel ?? element.rel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BreadcrumbLink {
	@Input() href: string;
	/**
	 * Marks the link as the current page.
	 */
	@Input({ transform: booleanAttribute }) isCurrentPage: boolean;
	/**
	 * `aria-current` of the current page link.
	 */
	@Input() ariaCurrent: string;
	@Input() target: string;
	@Input() rel: string;

	protected element = inject(ElementRef).nativeElement;
}

/**
 * Overflow menu for the collapsed items of a breadcrumb. Put a `cds-overflow-menu-body` in it.
 *
 * Adds Angular inputs to the `<cds-breadcrumb-overflow-menu>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-breadcrumb-overflow-menu",
	template: "<ng-content />",
	host: {
		"[align]": "align ?? element.align",
		"[size]": "size ?? element.size"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BreadcrumbOverflowMenu {
	/**
	 * Tooltip and menu alignment.
	 */
	@Input() align: string;
	@Input() size: string;

	protected element = inject(ElementRef).nativeElement;
}

/**
 * Loading state of a breadcrumb.
 *
 * Adds Angular inputs to the `<cds-breadcrumb-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-breadcrumb-skeleton",
	template: "<ng-content />",
	host: {
		"[items]": "items ?? element.items",
		"[noTrailingSlash]": "noTrailingSlash ?? element.noTrailingSlash",
		"[size]": "size ?? element.size"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BreadcrumbSkeleton {
	/**
	 * Number of items.
	 */
	@Input() items: number;
	@Input({ transform: booleanAttribute }) noTrailingSlash: boolean;
	@Input() size: "sm" | "md";

	protected element = inject(ElementRef).nativeElement;
}
