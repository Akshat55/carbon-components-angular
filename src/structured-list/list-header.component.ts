import {
	AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	ContentChildren,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	QueryList
} from "@angular/core";
import "@carbon/web-components/es/components/structured-list/index.js";
import { ListColumn } from "./list-column.component";

/**
 * The structured list header row. Renders `<cds-structured-list-head>`.
 */
@Component({
	selector: "cds-list-header",
	template: `
		<cds-structured-list-head>
			<cds-structured-list-header-row>
				<ng-content />
			</cds-structured-list-header-row>
		</cds-structured-list-head>
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListHeader implements AfterContentInit {
	@Input() set skeleton(value: boolean) {
		this._skeleton = value;
		this.updateChildren();
	}
	get skeleton() {
		return this._skeleton;
	}

	@ContentChildren(ListColumn) columns: QueryList<ListColumn>;

	/**
	 * @deprecated the web component adds the selection column itself.
	 */
	selection = false;

	protected _skeleton = false;

	ngAfterContentInit() {
		this.columns.forEach(column => column.isHeaderColumn = true);
		this.updateChildren();
	}

	protected updateChildren() {
		this.columns?.forEach(column => column.skeleton = this.skeleton);
	}
}
