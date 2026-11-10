import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/button/index.js";

/**
 * Wraps the `<cds-button-set>` web component. Project `<cds-button>`s.
 *
 * [See demo](../../?path=/story/components-button-button-set--basic)
 */
@Component({
	selector: "cds-button-set",
	template: "<ng-content />",
	host: {
		"[stacked]": "stacked"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ButtonSet {
	/**
	 * @deprecated not supported by the web component.
	 */
	@Input() fluid = false;
	@Input() stacked = false;
}
