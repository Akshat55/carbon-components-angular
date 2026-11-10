import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/skeleton-text/index.js";

/**
 * Wraps the `<cds-skeleton-text>` web component.
 *
 * [See demo](../../?path=/story/components-skeleton--basic)
 */
@Component({
	selector: "cds-skeleton-text",
	template: "",
	host: {
		"[paragraph]": "lines > 1",
		"[lineCount]": "lines",
		"[heading]": "heading",
		"[width]": "maxLineWidth + 'px'"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SkeletonText {
	@Input() lines = 5;
	/**
	 * @deprecated the web component uses one width for every line; see `maxLineWidth`.
	 */
	@Input() minLineWidth = 100;
	/**
	 * Line width in pixels.
	 */
	@Input() maxLineWidth = 300;
	@Input() heading = false;
	/**
	 * @deprecated not supported by the web component.
	 */
	@Input() ai = false;
}
