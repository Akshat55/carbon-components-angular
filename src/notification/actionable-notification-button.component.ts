import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/notification/index.js";

/**
 * The action button of a `cds-actionable-notification`. Give it `slot="action"`.
 *
 * Adds Angular inputs to the `<cds-actionable-notification-button>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-actionable-notification-button",
	template: "<ng-content />",
	host: {
		"[disabled]": "disabled ?? element.disabled"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActionableNotificationButton {
	@Input({ transform: booleanAttribute }) disabled: boolean;

	protected element = inject(ElementRef).nativeElement;
}
