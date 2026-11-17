import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/tag/index.js";

/**
 * Loading state of a tag.
 *
 * Adds Angular inputs to the `<cds-tag-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-tag-skeleton",
	template: "<ng-content />",
	host: {
		"[size]": "size ?? element.size"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TagSkeleton {
	@Input() size: "sm" | "md" | "lg";

	protected element = inject(ElementRef).nativeElement;
}
