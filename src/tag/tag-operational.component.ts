import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/tag/index.js";
import { TagType } from "./tag.component";

/**
 * Adds Angular inputs to the `<cds-operational-tag>` web component.
 *
 * ```html
 * <cds-operational-tag text="Tag" type="blue" />
 * ```
 *
 * [See demo](../../?path=/story/components-tag--operational)
 */
@Component({
	selector: "cds-operational-tag",
	template: "<ng-content />",
	host: {
		"[text]": "text",
		"[type]": "type",
		"[size]": "size",
		"[disabled]": "disabled"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TagOperationalComponent {
	@Input() text = "";
	@Input() type: TagType = "gray";
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() disabled = false;
}
