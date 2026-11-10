import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/tile/index.js";
import { TemplateSlot } from "carbon-components-angular/utils";

/**
 * A selectable tile. Renders `<cds-selectable-tile>` (checkbox) or, inside a single-select
 * `cds-tile-group`, `<cds-radio-tile>`.
 *
 * [See demo](../../?path=/story/components-tiles-grouped--selectable)
 */
@Component({
	selector: "cds-selection-tile",
	template: `
		<ng-template #content>
			<ng-content />
			<ng-container cdsSlot="decorator" [cdsSlotTemplate]="decorator" />
		</ng-template>
		@if (multiple) {
			<cds-selectable-tile
				[id]="id"
				[name]="name"
				[value]="value"
				[selected]="selected"
				[disabled]="disabled"
				[colorScheme]="theme === 'light' ? 'light' : ''"
				[hasRoundedCorners]="hasRoundedCorners"
				(cds-selectable-tile-changed)="onChange($event)">
				<ng-container *ngTemplateOutlet="content" />
			</cds-selectable-tile>
		} @else {
			<cds-radio-tile
				[id]="id"
				[name]="name"
				[value]="value"
				[selected]="selected"
				[disabled]="disabled"
				[colorScheme]="theme === 'light' ? 'light' : ''"
				[hasRoundedCorners]="hasRoundedCorners"
				(cds-radio-tile-selected)="onChange($event)">
				<ng-container *ngTemplateOutlet="content" />
			</cds-radio-tile>
		}
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectionTile {
	static tileCount = 0;

	@Input() theme: "light" | "dark" = "dark";
	@Input() id = `tile-${SelectionTile.tileCount++}`;
	@Input() set selected(value: boolean) {
		this._selected = !!value;
		this.changeDetectorRef.markForCheck();
	}
	get selected() {
		return this._selected;
	}
	@Input() value: string;
	@Input() disabled = false;
	@Input() decorator: TemplateRef<any>;
	@Input() hasRoundedCorners = false;

	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() change: EventEmitter<Event> = new EventEmitter();

	/**
	 * Set by the parent `cds-tile-group`.
	 */
	set name(value: string) {
		this._name = value;
		this.changeDetectorRef.markForCheck();
	}
	get name() {
		return this._name;
	}

	/**
	 * Set by the parent `cds-tile-group`; `false` renders a radio tile.
	 */
	set multiple(value: boolean) {
		this._multiple = value;
		this.changeDetectorRef.markForCheck();
	}
	get multiple() {
		return this._multiple;
	}

	protected changeDetectorRef = inject(ChangeDetectorRef);
	protected _selected = false;
	protected _name = "tile-group-unbound";
	protected _multiple = true;

	onChange(event: Event) {
		this.selected = (event as CustomEvent<{ selected: boolean }>).detail.selected;
		this.change.emit(event);
	}
}
