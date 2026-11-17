import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/tabs/index.js";

/**
 * Adds Angular inputs to the `<cds-tabs-vertical>` web component. Importing it registers the web component.
 *
 * Put a `cds-tabs` in the `tabs` slot and the panels in the `panel` slot:
 *
 * ```html
 * <cds-tabs-vertical height="400px">
 * 	<cds-tabs slot="tabs">
 * 		<cds-tab target="panel-one">One</cds-tab>
 * 		<cds-tab target="panel-two">Two</cds-tab>
 * 	</cds-tabs>
 * 	<div slot="panel" id="panel-one" role="tabpanel">First panel</div>
 * 	<div slot="panel" id="panel-two" role="tabpanel" hidden>Second panel</div>
 * </cds-tabs-vertical>
 * ```
 *
 * [See demo](../../?path=/story/components-tabs--vertical)
 */
@Component({
	selector: "cds-tabs-vertical",
	template: "<ng-content />",
	host: {
		"[customHeight]": "height"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabsVertical {
	/**
	 * Height of the component, e.g. `400px`.
	 */
	@Input() height: string;
}
