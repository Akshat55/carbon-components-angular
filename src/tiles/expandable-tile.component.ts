import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/tile/index.js";
import { TemplateSlot } from "carbon-components-angular/utils";

export interface ExpandableTileTranslations {
	EXPAND: string;
	COLLAPSE: string;
}

/**
 * Wraps the `<cds-expandable-tile>` web component. Mark the always-visible content with
 * `cdsAboveFold`; everything else is shown when expanded. Supports `[(expanded)]`.
 *
 * [See demo](../../?path=/story/components-tiles-expandable--basic)
 */
@Component({
	selector: "cds-expandable-tile",
	template: `
		<ng-content />
		<ng-container cdsSlot="decorator" [cdsSlotTemplate]="decorator" />
	`,
	host: {
		"[colorScheme]": "theme === 'light' ? 'light' : ''",
		"[expanded]": "expanded",
		"[withInteractive]": "interactive",
		"[hasRoundedCorners]": "hasRoundedCorners",
		"(cds-expandable-tile-toggled)": "onToggled($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExpandableTile {
	@Input() theme: "light" | "dark" = "dark";
	@Input() expanded = false;
	/**
	 * Set to `true` when the tile contains interactive elements.
	 */
	@Input() interactive = false;
	@Input() decorator: TemplateRef<any>;
	@Input() hasRoundedCorners = false;
	/**
	 * @deprecated the web component provides its own expand/collapse labels.
	 */
	@Input() translations: ExpandableTileTranslations;

	@Output() expandedChange = new EventEmitter<boolean>();

	onToggled(event: Event) {
		this.expanded = (event as CustomEvent<{ expanded: boolean }>).detail.expanded;
		this.expandedChange.emit(this.expanded);
	}
}
