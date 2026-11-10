import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/overflow-menu/index.js";
import { FloatingMenuCleanup } from "carbon-components-angular/utils";

/**
 * Adds Angular inputs to the `<cds-overflow-menu-body>` web component, the menu of a
 * `cds-overflow-menu`. It moves itself to `document.body` while open; it is removed with
 * its Angular view wherever it ended up.
 */
@Component({
	selector: "cds-overflow-menu-body",
	template: "<ng-content />",
	host: {
		"[flipped]": "flipped",
		"[direction]": "direction"
	},
	hostDirectives: [FloatingMenuCleanup],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverflowMenuBody {
	/**
	 * Aligns the menu to the right edge of the trigger.
	 */
	@Input() flipped = false;
	@Input() direction: "top" | "bottom" = "bottom";
}
