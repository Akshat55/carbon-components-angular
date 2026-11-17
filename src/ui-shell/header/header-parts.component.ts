import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";

/**
 * The product name in `cds-header`.
 *
 * Adds Angular inputs to the `<cds-header-name>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-header-name",
	template: "<ng-content />",
	host: {
		"[href]": "href ?? element.href",
		"[prefix]": "prefix ?? element.prefix"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderName {
	@Input() href: string;
	/**
	 * Text before the name, e.g. `IBM`.
	 */
	@Input() prefix: string;

	protected element = inject(ElementRef).nativeElement;
}

/**
 * Header navigation repeated in the side nav on small screens.
 *
 * Adds Angular inputs to the `<cds-header-side-nav-items>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-header-side-nav-items",
	template: "<ng-content />",
	host: {
		"[hasDivider]": "hasDivider ?? element.hasDivider"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderSideNavItems {
	/**
	 * Adds a divider after the items.
	 */
	@Input({ transform: booleanAttribute }) hasDivider: boolean;

	protected element = inject(ElementRef).nativeElement;
}
