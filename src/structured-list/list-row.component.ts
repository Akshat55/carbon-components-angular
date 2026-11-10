import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/structured-list/index.js";

/**
 * A structured list row. Renders `<cds-structured-list-row>`; in a selectable list,
 * clicking it selects it and emits `change`.
 */
@Component({
	selector: "cds-list-row",
	template: `
		<cds-structured-list-row
			[selected]="selected"
			[selectionValue]="value"
			[attr.aria-label]="label"
			(click)="onClick($event)">
			<ng-content />
		</cds-structured-list-row>
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListRow {
	@Input() set selected(value: boolean) {
		this._selected = value;
		this.changeDetectorRef.markForCheck();
	}
	get selected() {
		return this._selected;
	}

	@Input() label: string;
	@Input() value: any;

	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() change: EventEmitter<Event> = new EventEmitter();

	/**
	 * Set by the parent `cds-structured-list`.
	 */
	selection = false;
	name = "list";

	protected changeDetectorRef = inject(ChangeDetectorRef);
	protected _selected = false;

	onClick(event: Event) {
		if (this.selection) {
			this.selected = true;
			this.change.emit(event);
		}
	}
}
