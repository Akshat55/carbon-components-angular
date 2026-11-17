import {
	booleanAttribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
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
import { observeAttributes, TemplateSlot } from "carbon-components-angular/utils";

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
	@Input({ transform: booleanAttribute }) selected = false;
	@Input({ transform: booleanAttribute }) disabled = false;
	@Input() theme: "light" | "dark" = "dark";
	@Input() decorator: TemplateRef<any>;
	@Input({ transform: booleanAttribute }) hasRoundedCorners = false;

	@Output() selectedChange = new EventEmitter<boolean>();

	protected element = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		// The web component reflects `selected`, also when a `cds-tile-group` deselects a radio tile.
		observeAttributes(this.element, ["selected"], () => {
			const selected = this.element.selected;
			if (selected !== this.selected) {
				this.selected = selected;
				this.selectedChange.emit(selected);
				this.changeDetectorRef.markForCheck();
			}
		});
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
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RadioTile extends BaseSelectionTile {}
