import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/tile/index.js";
import { TemplateSlot } from "carbon-components-angular/utils";

/**
 * Wraps the `<cds-tile>` web component.
 *
 * [See demo](../../?path=/story/components-tiles--basic)
 */
@Component({
	selector: "cds-tile",
	template: `
		<ng-content />
		<ng-container cdsSlot="decorator" [cdsSlotTemplate]="decorator" />
	`,
	host: {
		"[colorScheme]": "theme === 'light' ? 'light' : ''",
		"[hasRoundedCorners]": "hasRoundedCorners"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tile {
	/**
	 * Optional `TemplateRef` (e.g. AI label) rendered in the decorator slot.
	 */
	@Input() decorator: TemplateRef<any>;
	@Input() hasRoundedCorners = false;
	@Input() theme: "light" | "dark" = "dark";
}
