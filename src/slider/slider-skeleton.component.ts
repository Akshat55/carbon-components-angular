import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/slider/index.js";

/**
 * Loading state of a slider.
 *
 * Adds Angular inputs to the `<cds-slider-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-slider-skeleton",
	template: "<ng-content />",
	host: {
		"[twoHandles]": "twoHandles ?? element.twoHandles"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SliderSkeleton {
	/**
	 * Shows a range slider.
	 */
	@Input({ transform: booleanAttribute }) twoHandles: boolean;

	protected element = inject(ElementRef).nativeElement;
}
