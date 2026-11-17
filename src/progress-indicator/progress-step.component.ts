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
 * Adds Angular inputs to the `<cds-progress-step>` web component: a step of `cds-progress-indicator`
 * written as a child instead of passed in `[steps]`.
 *
 * ```html
 * <cds-progress-indicator [current]="1" (stepSelected)="go($event.index)">
 * 	<cds-progress-step label="First" />
 * 	<cds-progress-step label="Second" />
 * 	<cds-progress-step label="Third" invalid />
 * </cds-progress-indicator>
 * ```
 *
 * Steps can be picked when the indicator's `stepSelected` is observed. The indicator's `current`
 * sets each step's state. To fix a step's state instead, write the `complete`, `current` or `state`
 * attribute on it (the web component reads them once, when the step is added).
 */
@Component({
	selector: "cds-progress-step",
	template: "<ng-content />",
	host: {
		"[label]": "label",
		"[secondaryLabel]": "secondaryLabel",
		"[description]": "description",
		"[disabled]": "disabled",
		"[invalid]": "invalid",
		"[iconLabel]": "iconLabel",
		"[state]": "state ?? element.state",
		"[clickable]": "clickable ?? element.clickable"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProgressStep {
	@Input() label = "";
	@Input() secondaryLabel = "";
	/**
	 * Tooltip text of the step.
	 */
	@Input() description = "";
	@Input({ transform: booleanAttribute }) disabled = false;
	@Input({ transform: booleanAttribute }) invalid = false;
	/**
	 * Accessible text for the step's state icon.
	 */
	@Input() iconLabel: string;
	/**
	 * Unset, the indicator's `current` decides it.
	 */
	@Input() state: "complete" | "current" | "incomplete" | "invalid" | undefined;

	/**
	 * Unset, the `cds-progress-indicator` makes its steps clickable while `stepSelected` is observed.
	 */
	@Input({ transform: booleanAttribute }) clickable?: boolean;

	protected element: HTMLElement & { state: string, clickable: boolean } = inject(ElementRef).nativeElement;
}
