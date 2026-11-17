import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/skeleton-placeholder/index.js";

/**
 * Adds Angular inputs and outputs to the `<cds-skeleton-placeholder>` web component.
 */
@Component({
	selector: "cds-skeleton-placeholder",
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SkeletonPlaceholder {
	/**
	 * @deprecated not supported by the web component.
	 */
	@Input({ transform: booleanAttribute }) ai = false;
}
