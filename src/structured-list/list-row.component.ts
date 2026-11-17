import {
	booleanAttribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/structured-list/index.js";
import { observeAttributes } from "carbon-components-angular/utils";

/**
 * Adds Angular inputs and `[(selected)]` to the `<cds-structured-list-row>` web component.
 * `value` becomes the list's form value when the row is selected.
 */
@Component({
	selector: "cds-structured-list-row",
	template: "<ng-content />",
	host: {
		"[selected]": "selected",
		"[selectionValue]": "value",
		"[attr.aria-label]": "label"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListRow {
	@Input({ transform: booleanAttribute }) selected = false;
	@Input() label: string;
	@Input() value = "";

	/**
	 * Emits when the row is selected or deselected (in a list with `selection`).
	 */
	@Output() selectedChange = new EventEmitter<boolean>();

	protected element = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		// The web component reflects `selected`, also when selecting another row deselects this one.
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
 * The `<cds-structured-list-body>` web component.
 */
@Component({
	selector: "cds-structured-list-body",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListBody {}
