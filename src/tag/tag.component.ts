import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/tag/index.js";
import { TemplateSlot } from "carbon-components-angular/utils";

export type TagType = "red" |
	"magenta" |
	"purple" |
	"blue" |
	"cyan" |
	"teal" |
	"green" |
	"gray" |
	"cool-gray" |
	"warm-gray" |
	"high-contrast" |
	"outline";

/**
 * Wraps the `<cds-tag>` web component. Icons marked with `cdsTagIcon` go in the icon slot.
 *
 * [See demo](../../?path=/story/components-tag--basic)
 */
@Component({
	selector: "cds-tag",
	template: `
		@if (!skeleton) {
			<ng-content />
			<ng-container cdsSlot="decorator" [cdsSlotTemplate]="decorator" />
		}
	`,
	host: {
		"[type]": "type",
		"[size]": "size"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tag {
	@Input() type: TagType = "gray";
	@Input() size: "sm" | "md" | "lg" = "md";
	/**
	 * @deprecated hides the content only. Use `<cds-tag-skeleton>` instead.
	 */
	@Input() skeleton = false;
	/**
	 * Optional `TemplateRef` (e.g. AI label) rendered in the decorator slot.
	 */
	@Input() decorator: TemplateRef<any>;
}
