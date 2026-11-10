import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/toggle-tip/index.js";
import { PopoverBase } from "carbon-components-angular/popover";

/**
 * Wraps the `<cds-toggletip>` web component.
 *
 * ```html
 * <cds-toggletip>
 * 	<span cdsToggletipLabel>Label</span>
 * 	<div cdsToggletipContent>Details</div>
 * </cds-toggletip>
 * ```
 *
 * `cdsToggletipButton` content becomes the trigger icon (the web component renders the button).
 *
 * [See demo](../../?path=/story/components-toggletip--basic)
 */
@Component({
	selector: "cds-toggletip",
	template: "<ng-content />",
	host: {
		"[id]": "id",
		"[alignment]": "align",
		"[alignmentAxisOffset]": "alignmentAxisOffset",
		"[buttonLabel]": "buttonLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Toggletip extends PopoverBase {
	static toggletipCounter = 0;

	@Input() id = `toggletip-${Toggletip.toggletipCounter++}`;
	@Input() alignmentAxisOffset: number;
	@Input() buttonLabel = "Show information";
}
