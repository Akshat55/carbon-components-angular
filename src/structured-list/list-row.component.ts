import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/structured-list/index.js";
import { registerWrapper } from "carbon-components-angular/utils";

/**
 * Adds Angular inputs to the `<cds-structured-list-row>` web component. `value` can be any
 * value; it becomes the list's form value when the row is selected.
 */
@Component({
	selector: "cds-structured-list-row",
	template: "<ng-content />",
	host: {
		"[selected]": "selected",
		"[selectionValue]": "selectionValue",
		"[attr.aria-label]": "label"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListRow {
	static rowCount = 0;

	@Input() selected = false;
	@Input() label: string;
	@Input() set value(value: any) {
		this._value = value;
		const primitive = value === null || value === undefined || typeof value !== "object";
		this.selectionValue = primitive ? String(value ?? "") : `structured-list-row-${ListRow.rowCount++}`;
	}
	get value() {
		return this._value;
	}

	/**
	 * Emits when the user selects the row (in a list with `selection`).
	 */
	@Output() selectedChange = new EventEmitter<boolean>();

	/**
	 * The value given to the web component.
	 */
	selectionValue = "";
	protected _value: any;

	constructor() {
		registerWrapper(inject(ElementRef).nativeElement, this);
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
