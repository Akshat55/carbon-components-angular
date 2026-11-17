import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/password-input/index.js";
import "@carbon/web-components/es/components/text-input/index.js";
import "@carbon/web-components/es/components/textarea/index.js";

/**
 * Loading state of a text input.
 *
 * Adds Angular inputs to the `<cds-text-input-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-text-input-skeleton",
	template: "<ng-content />",
	host: {
		"[hideLabel]": "hideLabel ?? element.hideLabel",
		"[size]": "size ?? element.size"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TextInputSkeleton {
	@Input({ transform: booleanAttribute }) hideLabel: boolean;
	@Input() size: "sm" | "md" | "lg";

	protected element = inject(ElementRef).nativeElement;
}

/**
 * Loading state of a text area.
 *
 * Adds Angular inputs to the `<cds-textarea-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-textarea-skeleton",
	template: "<ng-content />",
	host: {
		"[hideLabel]": "hideLabel ?? element.hideLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TextareaSkeleton {
	@Input({ transform: booleanAttribute }) hideLabel: boolean;

	protected element = inject(ElementRef).nativeElement;
}

/**
 * Loading state of a password input.
 *
 * Adds Angular inputs to the `<cds-password-input-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-password-input-skeleton",
	template: "<ng-content />",
	host: {
		"[hideLabel]": "hideLabel ?? element.hideLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PasswordInputSkeleton {
	@Input({ transform: booleanAttribute }) hideLabel: boolean;

	protected element = inject(ElementRef).nativeElement;
}
