import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/link/index.js";

/**
 * Wraps the `<cds-link>` web component. Icons go in `slot="icon"` (or use `cdsLinkIcon`).
 *
 * ```html
 * <cds-link href="https://carbondesignsystem.com" inline>Carbon</cds-link>
 * ```
 *
 * [See demo](../../?path=/story/components-link--basic)
 */
@Component({
	selector: "cds-link",
	template: `<ng-content />`,
	host: {
		"[href]": "href",
		"[target]": "target",
		"[rel]": "rel",
		"[download]": "download",
		"[inline]": "inline",
		"[size]": "size",
		"[visited]": "visited",
		"[disabled]": "disabled"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CdsLink {
	@Input() href: string;
	@Input() target: string;
	@Input() rel: string;
	@Input() download: string;
	@Input() inline = false;
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() visited = false;
	@Input() disabled = false;
}
