import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/skeleton-icon/index.js";

/**
 * Wraps the `<cds-skeleton-icon>` web component.
 */
@Component({
	selector: "cds-skeleton-icon",
	template: "",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SkeletonIcon {
	/**
	 * @deprecated not supported by the web component.
	 */
	@Input() ai = false;
}
