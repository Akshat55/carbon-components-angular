import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output
} from "@angular/core";
import "@carbon/web-components/es/components/structured-list/index.js";
import { provideValueAccessor, WebComponentValueAccessor } from "carbon-components-angular/utils";

/**
 * Adds `ngModel` / reactive forms to the `<cds-structured-list>` web component.
 * With `selection`, rows behave like radio buttons; the value is the selected row's `value`.
 * The web component passes `selectionName`, `condensed` and `flush` on to its rows.
 *
 * ```html
 * <cds-structured-list [selection]="true" [(ngModel)]="selected">
 * 	<cds-structured-list-head>
 * 		<cds-structured-list-header-row>
 * 			<cds-structured-list-header-cell>Name</cds-structured-list-header-cell>
 * 		</cds-structured-list-header-row>
 * 	</cds-structured-list-head>
 * 	<cds-structured-list-body>
 * 		<cds-structured-list-row value="a"><cds-structured-list-cell>A</cds-structured-list-cell></cds-structured-list-row>
 * 	</cds-structured-list-body>
 * </cds-structured-list>
 * ```
 *
 * [See demo](../../?path=/story/components-structured-list--basic)
 */
@Component({
	selector: "cds-structured-list",
	template: "<ng-content />",
	host: {
		"[selectionName]": "selection ? name : ''",
		"[flush]": "flushed",
		"[condensed]": "condensed",
		"[attr.aria-label]": "ariaLabel",
		"(click)": "onUserSelect()",
		"(keydown)": "onUserSelect()"
	},
	providers: [provideValueAccessor(() => StructuredList)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StructuredList extends WebComponentValueAccessor {
	static listCount = 0;

	@Input({ transform: booleanAttribute }) selection = false;
	@Input({ transform: booleanAttribute }) flushed = false;
	@Input({ transform: booleanAttribute }) condensed = false;
	@Input() name = `structured-list-${StructuredList.listCount++}`;
	@Input() ariaLabel = "Structured list section";

	@Output() selected = new EventEmitter<{ value: any, selected: boolean, name: string }>();

	protected value: string;

	writeValue(value: string) {
		this.value = value;
		// Forms write the first value before the rows' own bindings (e.g. `[value]`) ran.
		queueMicrotask(() => this.rows().forEach(row => row.selected = row.selectionValue === value));
	}

	onUserSelect() {
		if (!this.selection) {
			return;
		}
		// The row selects itself after the event.
		queueMicrotask(() => {
			const row = this.rows().find(element => element.selected);
			if (!row || row.selectionValue === this.value) {
				return;
			}
			this.value = row.selectionValue;
			this.selected.emit({ value: this.value, selected: true, name: this.name });
			this.onChange(this.value);
			this.onTouched();
		});
	}

	protected rows(): any[] {
		return Array.from(this.element.querySelectorAll("cds-structured-list-row"));
	}
}
