import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/structured-list/index.js";
import {
	observeChildren,
	provideValueAccessor,
	WebComponentValueAccessor,
	wrapperOf
} from "carbon-components-angular/utils";
import { ListRow } from "./list-row.component";

/**
 * Adds `ngModel` / reactive forms to the `<cds-structured-list>` web component.
 * With `selection`, rows behave like radio buttons; the value is the selected row's `value`.
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
 * The rows are read from the DOM, so rows from templates, `@for` or `createComponent` all work.
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

	@Input() selection = false;
	@Input() flushed = false;
	@Input() condensed = false;
	@Input() name = `structured-list-${StructuredList.listCount++}`;
	@Input() ariaLabel = "Structured list section";

	@Output() selected = new EventEmitter<{ value: any, selected: boolean, name: string }>();

	protected value: any;
	protected hasValue = false;

	constructor() {
		super();
		// The web component only names the rows it has when `selectionName` changes.
		observeChildren(this.element, inject(DestroyRef), () => this.sync());
	}

	writeValue(value: any) {
		this.value = value;
		this.hasValue = true;
		this.sync();
	}

	/**
	 * The web component selects rows itself without an event; read the selection back.
	 */
	onUserSelect() {
		if (!this.selection) {
			return;
		}
		queueMicrotask(() => {
			const row = this.rows().find(element => element.selected);
			if (!row || (this.hasValue && this.valueOf(row) === this.value)) {
				return;
			}
			this.value = this.valueOf(row);
			this.hasValue = true;
			this.sync();
			this.selected.emit({ value: this.value, selected: true, name: this.name });
			this.onChange(this.value);
			this.onTouched();
		});
	}

	protected rows(): any[] {
		return Array.from(this.element.querySelectorAll("cds-structured-list-row"));
	}

	protected valueOf(row: any) {
		const instance = wrapperOf(row, ListRow);
		return instance ? instance.value : row.selectionValue;
	}

	protected sync() {
		for (const row of this.rows()) {
			row.selectionName = this.selection ? this.name : "";
			if (this.hasValue) {
				const selected = this.valueOf(row) === this.value;
				const instance = wrapperOf(row, ListRow);
				if (instance && instance.selected !== selected) {
					instance.selected = selected;
					instance.selectedChange.emit(selected);
				}
				row.selected = selected;
			}
		}
	}
}
