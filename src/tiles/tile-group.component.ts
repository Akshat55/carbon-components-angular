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
import { provideValueAccessor, TemplateSlot, WebComponentValueAccessor } from "carbon-components-angular/utils";
import { TileSelection } from "./tile-selection.interface";

@Component({
	selector: "cds-tile-group",
	template: `
		@if (isTemplate(legend)) {
			<ng-container cdsSlot="legend" [cdsSlotTemplate]="legend" />
		} @else if (legend) {
			<span slot="legend">{{ legend }}</span>
		}
		<ng-content />
	`,
	host: {
		"(cds-radio-tile-selected)": "onTileChange($event)",
		"(cds-selectable-tile-changed)": "onTileChange($event)"
	},
	providers: [provideValueAccessor(() => TileGroup)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TileGroup extends WebComponentValueAccessor {
	static tileGroupCount = 0;

	@Input() name = `tile-group-${TileGroup.tileGroupCount++}`;
	@Input() legend: string | TemplateRef<any>;

	@Output() selected: EventEmitter<TileSelection> = new EventEmitter();

	protected value: any;

	writeValue(value: any) {
		this.value = value;
		// Forms write the first value before the tiles' own bindings (e.g. `[value]`) ran.
		queueMicrotask(() => {
			const values = Array.isArray(value) ? value : [value];
			this.tiles().forEach(tile => tile.selected = values.includes(tile.value));
			// The web component deselects its current radio tile when another is picked.
			this.element.currentRadioSelection = this.tiles().find(tile => tile.localName === "cds-radio-tile" && tile.selected);
		});
	}

	onTileChange(event: Event) {
		// The web component group deselects the other radio tiles itself.
		const tile = event.target as any;
		const radio = tile.localName === "cds-radio-tile";
		this.value = radio ? tile.value : this.tiles().filter(other => other.selected).map(other => other.value);
		this.selected.emit({ value: tile.value, selected: tile.selected, name: this.name });
		this.onChange(this.value);
		this.onTouched();
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}

	protected tiles(): any[] {
		return Array.from(this.element.querySelectorAll("cds-radio-tile, cds-selectable-tile"));
	}

	protected onDisabledChange() {
		// The web component only disables its tiles on its first render.
		if (this.disabled !== undefined) {
			this.tiles().forEach(tile => tile.disabled = this.disabled);
		}
	}
}
