import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/tile/index.js";
import { registerWrapper, TemplateSlot } from "carbon-components-angular/utils";

/**
 * Inputs and `[(selected)]` shared by `SelectableTile` and `RadioTile`.
 */
@Directive({
	host: {
		"[id]": "id",
		"[value]": "value",
		"[selected]": "selected",
		"[disabled]": "disabled",
		"[colorScheme]": "theme === 'light' ? 'light' : ''",
		"[hasRoundedCorners]": "hasRoundedCorners"
	}
})
export abstract class BaseSelectionTile {
	static tileCount = 0;

	@Input() id = `tile-${BaseSelectionTile.tileCount++}`;
	@Input() value: string;
	@Input() selected = false;
	@Input() disabled = false;
	@Input() theme: "light" | "dark" = "dark";
	@Input() decorator: TemplateRef<any>;
	@Input() hasRoundedCorners = false;

	@Output() selectedChange = new EventEmitter<boolean>();

	constructor() {
		registerWrapper(inject(ElementRef).nativeElement, this);
	}

	onSelected(event: Event) {
		this.selected = (event as CustomEvent<{ selected: boolean }>).detail.selected;
		this.selectedChange.emit(this.selected);
	}
}

/**
 * Adds Angular inputs and `[(selected)]` to the `<cds-selectable-tile>` web component
 * (a tile that toggles like a checkbox). Put several in a `cds-tile-group` for a form value.
 *
 * [See demo](../../?path=/story/components-tiles-grouped--selectable)
 */
@Component({
	selector: "cds-selectable-tile",
	template: `
		<ng-content />
		<ng-container cdsSlot="decorator" [cdsSlotTemplate]="decorator" />
	`,
	host: {
		"(cds-selectable-tile-changed)": "onSelected($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectableTile extends BaseSelectionTile {}

/**
 * Adds Angular inputs and `[(selected)]` to the `<cds-radio-tile>` web component
 * (one selected per group). Put several in a `cds-tile-group`.
 *
 * [See demo](../../?path=/story/components-tiles-grouped--radio)
 */
@Component({
	selector: "cds-radio-tile",
	template: `
		<ng-content />
		<ng-container cdsSlot="decorator" [cdsSlotTemplate]="decorator" />
	`,
	host: {
		"(cds-radio-tile-selected)": "onSelected($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RadioTile extends BaseSelectionTile {}
