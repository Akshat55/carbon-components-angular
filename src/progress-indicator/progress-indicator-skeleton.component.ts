import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/progress-indicator/index.js";

/**
 * Loading state of a progress indicator. Project `cds-progress-step-skeleton`s.
 *
 * Adds Angular inputs to the `<cds-progress-indicator-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-progress-indicator-skeleton",
	template: "<ng-content />",
	host: {
		"[vertical]": "vertical ?? element.vertical"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProgressIndicatorSkeleton {
	@Input({ transform: booleanAttribute }) vertical: boolean;

	protected element = inject(ElementRef).nativeElement;
}

/**
 * Loading state of a progress step.
 *
 * Adds Angular inputs to the `<cds-progress-step-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-progress-step-skeleton",
	template: "<ng-content />",
	host: {
		"[vertical]": "vertical ?? element.vertical"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProgressStepSkeleton {
	@Input({ transform: booleanAttribute }) vertical: boolean;

	protected element = inject(ElementRef).nativeElement;
}
