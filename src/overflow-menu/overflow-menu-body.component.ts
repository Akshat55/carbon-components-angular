import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	ElementRef,
	inject
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
		"[flipped]": "flipped ?? element.flipped",
		"[direction]": "direction ?? element.direction"
	},
	hostDirectives: [FloatingMenuCleanup],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverflowMenuBody {
	/**
	 * Aligns the menu to the right edge of the trigger.
	 */
	@Input({ transform: booleanAttribute }) flipped?: boolean;
	/**
	 * The web component's default is `"bottom"`.
	 */
	@Input() direction?: "top" | "bottom";

	protected element = inject(ElementRef).nativeElement;
}
