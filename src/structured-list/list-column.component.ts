import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	inject
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/structured-list/index.js";

/**
 * A structured list cell. Renders `<cds-structured-list-header-cell>` inside `cds-list-header`
 * and `<cds-structured-list-cell>` inside `cds-list-row`.
 */
@Component({
	selector: "cds-list-column",
	template: `
		<ng-template #content><ng-content /></ng-template>
		@if (isHeaderColumn) {
			<cds-structured-list-header-cell [skeleton]="skeleton">
				<ng-container *ngTemplateOutlet="content" />
			</cds-structured-list-header-cell>
		} @else {
			<cds-structured-list-cell [class.cds--structured-list-content--nowrap]="nowrap">
				<ng-container *ngTemplateOutlet="content" />
			</cds-structured-list-cell>
		}
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListColumn {
	@Input() set skeleton(value: boolean) {
		this._skeleton = value;
		this.changeDetectorRef.markForCheck();
	}
	get skeleton() {
		return this._skeleton;
	}

	@Input() nowrap = false;

	/**
	 * Set by the parent `cds-list-header` / `cds-list-row`.
	 */
	set isHeaderColumn(value: boolean) {
		this._isHeaderColumn = value;
		this.changeDetectorRef.markForCheck();
	}
	get isHeaderColumn() {
		return this._isHeaderColumn;
	}

	protected changeDetectorRef = inject(ChangeDetectorRef);
	protected _skeleton = false;
	protected _isHeaderColumn = false;
}
