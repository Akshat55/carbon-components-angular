import {
	AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	ContentChildren,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	OnDestroy,
	Output,
	QueryList,
	TemplateRef
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import "@carbon/web-components/es/components/tile/index.js";
import { provideValueAccessor, TemplateSlot, WebComponentValueAccessor } from "carbon-components-angular/utils";
import { SelectionTile } from "./selection-tile.component";
import { TileSelection } from "./tile-selection.interface";

/**
 * Wraps the `<cds-tile-group>` web component. Works with `ngModel` / reactive forms;
 * the value is the selected tile's `value`.
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
	providers: [provideValueAccessor(() => TileGroup)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TileGroup extends WebComponentValueAccessor implements AfterContentInit, OnDestroy {
	static tileGroupCount = 0;

	@Input() name = `tile-group-${TileGroup.tileGroupCount++}`;
	/**
	 * Allows selecting more than one tile (checkbox tiles instead of radio tiles).
	 */
	@Input() multiple = false;
	@Input() legend: string | TemplateRef<any>;

	@Output() selected: EventEmitter<TileSelection> = new EventEmitter();

	@ContentChildren(SelectionTile) selectionTiles: QueryList<SelectionTile>;

	protected unsubscribe$ = new Subject<void>();
	protected unsubscribeTiles$ = new Subject<void>();
	private value: any;

	ngAfterContentInit() {
		this.updateTiles();
		this.selectionTiles.changes.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.updateTiles());
	}

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
		this.unsubscribeTiles$.next();
		this.unsubscribeTiles$.complete();
	}

	writeValue(value: any) {
		this.value = value;
		this.selectionTiles?.forEach(tile => tile.selected = tile.value === value);
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}

	protected updateTiles() {
		this.unsubscribeTiles$.next();
		this.selectionTiles.forEach(tile => {
			tile.name = this.name;
			tile.multiple = this.multiple;
			tile.change.pipe(takeUntil(this.unsubscribeTiles$)).subscribe(() => {
				if (!this.multiple) {
					this.selectionTiles.forEach(other => other.selected = other === tile);
				}
				this.selected.emit({ value: tile.value, selected: tile.selected, name: this.name });
				this.onChange(tile.value);
			});
		});
		if (this.value !== undefined) {
			this.writeValue(this.value);
		}
	}
}
