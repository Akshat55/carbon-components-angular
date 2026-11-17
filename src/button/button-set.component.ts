import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/button/index.js";

/**
 * Adds Angular inputs and outputs to the `<cds-button-set>` web component. Project `<cds-button>`s.
 *
 * [See demo](../../?path=/story/components-button-button-set--basic)
 */
@Component({
	selector: "cds-button-set",
	template: "<ng-content />",
	host: {
		"[stacked]": "stacked ?? element.stacked"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ButtonSet {
	/**
	 * @deprecated not supported by the web component.
	 */
	@Input({ transform: booleanAttribute }) fluid = false;
	@Input({ transform: booleanAttribute }) stacked?: boolean;

	protected element = inject(ElementRef).nativeElement;
}
