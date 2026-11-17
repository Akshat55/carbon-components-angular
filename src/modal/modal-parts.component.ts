import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/modal/index.js";

/**
 * The title of a modal, in `cds-modal-header`.
 *
 * Angular class for the `<cds-modal-heading>` web component, so templates can use it without
 * `CUSTOM_ELEMENTS_SCHEMA`. Importing it registers the web component.
 */
@Component({
	selector: "cds-modal-heading",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalHeading {}

/**
 * The label above the title of a modal, in `cds-modal-header`.
 *
 * Angular class for the `<cds-modal-label>` web component, so templates can use it without
 * `CUSTOM_ELEMENTS_SCHEMA`. Importing it registers the web component.
 */
@Component({
	selector: "cds-modal-label",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalLabel {}

/**
 * The content of a modal.
 *
 * Angular class for the `<cds-modal-body>` web component, so templates can use it without
 * `CUSTOM_ELEMENTS_SCHEMA`. Importing it registers the web component.
 */
@Component({
	selector: "cds-modal-body",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalBody {}

/**
 * Text in a `cds-modal-body`.
 *
 * Angular class for the `<cds-modal-body-content>` web component, so templates can use it without
 * `CUSTOM_ELEMENTS_SCHEMA`. Importing it registers the web component.
 */
@Component({
	selector: "cds-modal-body-content",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalBodyContent {}

/**
 * The close button of a modal, in `cds-modal-header`.
 *
 * Adds Angular inputs to the `<cds-modal-close-button>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-modal-close-button",
	template: "<ng-content />",
	host: {
		"[closeButtonLabel]": "closeButtonLabel ?? element.closeButtonLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalCloseButton {
	/**
	 * Accessible label of the button.
	 */
	@Input() closeButtonLabel: string;

	protected element = inject(ElementRef).nativeElement;
}

/**
 * A button in `cds-modal-footer`.
 *
 * Adds Angular inputs to the `<cds-modal-footer-button>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-modal-footer-button",
	template: "<ng-content />",
	host: {
		"[kind]": "kind ?? element.kind",
		"[disabled]": "disabled ?? element.disabled",
		"[type]": "type ?? element.type",
		"[href]": "href ?? element.href"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalFooterButton {
	@Input() kind: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
	@Input({ transform: booleanAttribute }) disabled: boolean;
	@Input() type: "button" | "submit" | "reset";
	@Input() href: string;

	protected element = inject(ElementRef).nativeElement;
}
