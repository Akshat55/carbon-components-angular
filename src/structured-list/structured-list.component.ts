import {
	AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	ContentChildren,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	QueryList
} from "@angular/core";
import "@carbon/web-components/es/components/structured-list/index.js";
import { provideValueAccessor, WebComponentValueAccessor } from "carbon-components-angular/utils";
import { ListHeader } from "./list-header.component";
import { ListRow } from "./list-row.component";

/**
 * Wraps the `<cds-structured-list>` web component. With `selection`, rows behave like
 * radio buttons and the list works with `ngModel` / reactive forms (value = the row's `value`).
 *
 * [See demo](../../?path=/story/components-structured-list--basic)
 */
@Component({
	selector: "cds-structured-list",
	template: `
		<ng-content select="cds-list-header" />
		<cds-structured-list-body>
			<ng-content />
		</cds-structured-list-body>
	`,
	host: {
		"[selectionName]": "selection ? name : ''",
		"[flush]": "flushed",
		"[condensed]": "condensed",
		"[attr.aria-label]": "ariaLabel"
	},
	providers: [provideValueAccessor(() => StructuredList)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StructuredList extends WebComponentValueAccessor implements AfterContentInit {
	static listCount = 0;

	/**
	 * Lets the user select a row.
	 */
	@Input() selection = false;
	@Input() flushed = false;
	@Input() condensed = false;
	@Input() name = `structured-list-${StructuredList.listCount++}`;
	@Input() ariaLabel = "Structured list section";

	@Input() set skeleton(value: boolean) {
		this._skeleton = value;
		this.updateChildren();
	}
	get skeleton() {
		return this._skeleton;
	}

	@Output() selected = new EventEmitter<{ value: string, selected: boolean, name: string }>();

	@ContentChildren(ListRow) rows: QueryList<ListRow>;
	@ContentChildren(ListHeader) headers: QueryList<ListHeader>;

	protected _skeleton = false;
	private value: any;

	ngAfterContentInit() {
		this.headers.forEach(header => header.selection = this.selection);
		this.rows.forEach(row => {
			row.selection = this.selection;
			row.name = this.name;
			row.change.subscribe(() => {
				this.selected.emit({ value: row.value, selected: row.selected, name: this.name });
				this.onChange(row.value);
				this.writeValue(row.value);
			});
		});
		this.writeValue(this.value);
		this.updateChildren();
	}

	writeValue(value: any) {
		this.value = value;
		this.rows?.forEach(row => row.selected = row.value === value);
	}

	protected updateChildren() {
		this.headers?.forEach(header => header.skeleton = this.skeleton);
	}
}
