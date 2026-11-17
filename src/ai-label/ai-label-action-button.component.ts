import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/ai-label/index.js";

/**
 * An action button in an AI label's popover. Give it `slot="actions"`.
 *
 * Adds Angular inputs to the `<cds-ai-label-action-button>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-ai-label-action-button",
	template: "<ng-content />",
	host: {
		"[kind]": "kind ?? element.kind",
		"[disabled]": "disabled ?? element.disabled",
		"[href]": "href ?? element.href"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AILabelActionButton {
	@Input() kind: "primary" | "secondary" | "tertiary" | "ghost";
	@Input({ transform: booleanAttribute }) disabled: boolean;
	@Input() href: string;

	protected element = inject(ElementRef).nativeElement;
}
