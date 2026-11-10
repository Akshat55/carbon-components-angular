/**
 * Copyright IBM Corp. 2024
 *
 * Directives for the tile web components.
 *
 * Replaces the old Angular Tile / ClickableTile / ExpandableTile /
 * SelectionTile / TileGroup components with thin directives on:
 *   <cds-tile>, <cds-clickable-tile>, <cds-expandable-tile>,
 *   <cds-selectable-tile>, <cds-radio-tile>, <cds-tile-group>
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnInit,
	Output
} from "@angular/core";

@Directive({
	selector: "cds-tile, [cdsTile], [ibmTile]",
	standalone: true
})
export class CdsTileDirective { }

@Directive({
	selector: "cds-clickable-tile, [cdsClickableTile], [ibmClickableTile]",
	standalone: true
})
export class CdsClickableTileDirective implements OnChanges {
	/** Link destination. */
	@Input() href = "#";

	/** Anchor target. */
	@Input() target: string;

	/** Anchor rel. */
	@Input() rel: string;

	/** Set to `true` to disable the tile. */
	@Input() disabled = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("href", this.href);
		if (this.target) {
			el.setAttribute("target", this.target);
		}
		if (this.rel) {
			el.setAttribute("rel", this.rel);
		}
		if (this.disabled) {
			el.setAttribute("disabled", "");
		} else {
			el.removeAttribute("disabled");
		}
	}
}

@Directive({
	selector: "cds-expandable-tile, [cdsExpandableTile], [ibmExpandableTile]",
	standalone: true
})
export class CdsExpandableTileDirective implements OnChanges {
	/** Whether the tile is expanded. */
	@Input() expanded = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		if (this.expanded) {
			this._el.nativeElement.setAttribute("expanded", "");
		} else {
			this._el.nativeElement.removeAttribute("expanded");
		}
	}
}

/**
 * Routes content into the expandable tile's above-the-fold slot.
 * Preserves the old `cdsExpandableTileAbove` selector.
 */
@Directive({
	selector: "[cdsExpandableTileAbove], [ibmExpandableTileAbove]",
	standalone: true
})
export class CdsExpandableTileAboveDirective implements OnInit {
	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnInit(): void {
		this._el.nativeElement.setAttribute("slot", "above-the-fold-content");
	}
}

@Directive({
	selector: "cds-selectable-tile, cds-selection-tile, [cdsSelectionTile], [ibmSelectionTile]",
	standalone: true
})
export class CdsSelectableTileDirective implements OnChanges {
	/** Whether the tile is selected. */
	@Input() selected = false;

	/** Value submitted when this tile is selected. */
	@Input() value: string;

	/** Set to `true` to disable the tile. */
	@Input() disabled = false;

	/** Emits when the selection state changes. */
	@Output() change: EventEmitter<Event> = new EventEmitter();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		if (this.value !== undefined && this.value !== null) {
			el.setAttribute("value", this.value);
		}
		if (this.selected) {
			el.setAttribute("selected", "");
		} else {
			el.removeAttribute("selected");
		}
		if (this.disabled) {
			el.setAttribute("disabled", "");
		} else {
			el.removeAttribute("disabled");
		}
	}

	@HostListener("cds-selectable-tile-changed", ["$event"])
	onChanged(event: CustomEvent): void {
		this.selected = event.detail?.selected ?? this._el.nativeElement.hasAttribute("selected");
		this.change.emit(event);
	}
}

@Directive({
	selector: "cds-tile-group, [cdsTileGroup], [ibmTileGroup]",
	standalone: true
})
export class CdsTileGroupDirective implements OnChanges {
	/** Group name applied to child tiles. */
	@Input() name: string;

	/**
	 * `true` for multi-select (selectable tiles), `false` for single select
	 * (radio tiles). Informational — use the matching tile elements.
	 */
	@Input() multiple = false;

	/** Emits when the group selection changes. */
	@Output() selected = new EventEmitter<any>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		if (this.name) {
			this._el.nativeElement.setAttribute("name", this.name);
		}
	}

	@HostListener("cds-current-radio-tile-selection", ["$event"])
	@HostListener("cds-tile-group-changed", ["$event"])
	onSelected(event: CustomEvent): void {
		this.selected.emit(event.detail ?? event);
	}
}
