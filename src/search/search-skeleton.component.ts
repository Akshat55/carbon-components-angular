import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/search/index.js";

/**
 * Loading state of a search.
 *
 * Adds Angular inputs to the `<cds-search-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-search-skeleton",
	template: "<ng-content />",
	host: {
		"[size]": "size ?? element.size"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchSkeleton {
	@Input() size: "sm" | "md" | "lg";

	protected element = inject(ElementRef).nativeElement;
}
