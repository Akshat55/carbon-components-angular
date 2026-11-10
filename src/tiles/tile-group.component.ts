import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/tile/index.js";
import {
	observeChildren,
	provideValueAccessor,
	TemplateSlot,
	WebComponentValueAccessor,
	wrapperOf
} from "carbon-components-angular/utils";
import { BaseSelectionTile } from "./selection-tile.component";
import { TileSelection } from "./tile-selection.interface";

/**
 * Adds `ngModel` / reactive forms to the `<cds-tile-group>` web component.
 *
 * - With `cds-radio-tile`s one tile is selected; the value is its `value`.
 * - With `cds-selectable-tile`s any number are; the value is an array of their `value`s.
 *
 * The tiles are read from the DOM, so tiles from templates, `@for` or `createComponent` all work.
 *
 * [See demo](../../?path=/story/components-tiles-grouped--selectable)
 */
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

	constructor() {
		super();
		observeChildren(this.element, inject(DestroyRef), () => this.sync());
	}

	writeValue(value: any) {
		this.value = value;
		this.sync();
	}

	onTileChange(event: Event) {
		const tile = event.target as any;
		const radio = this.isRadio(tile);
		if (radio && tile.selected) {
			// The web component group misses tiles added after it rendered; deselect the others here.
			this.tiles().filter(other => other !== tile && this.isRadio(other)).forEach(other => this.select(other, false));
		}
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

	protected isRadio(tile: Element) {
		return tile.tagName === "CDS-RADIO-TILE";
	}

	/**
	 * Sets a tile's selected state, through its Angular instance when it has one.
	 */
	protected select(tile: any, selected: boolean) {
		const instance = wrapperOf(tile, BaseSelectionTile);
		if (instance) {
			instance.selected = selected;
		}
		tile.selected = selected;
	}

	protected sync() {
		const values = Array.isArray(this.value) ? this.value : [this.value];
		for (const tile of this.tiles()) {
			tile.name = this.name;
			if (this.value !== undefined) {
				this.select(tile, values.includes(tile.value));
			}
			if (this.disabled) {
				tile.disabled = true;
			}
		}
	}

	protected onDisabledChange() {
		this.sync();
	}
}
