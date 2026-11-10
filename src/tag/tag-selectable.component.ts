import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output
} from "@angular/core";
import "@carbon/web-components/es/components/tag/index.js";

/**
 * Wraps the `<cds-selectable-tag>` web component. Supports `[(selected)]`.
 *
 * [See demo](../../?path=/story/components-tag--selectable)
 */
@Component({
	selector: "cds-tag-selectable",
	template: `
		<cds-selectable-tag
			[size]="size"
			[disabled]="disabled"
			[selected]="selected"
			(cds-selectable-tag-selected)="onSelected($event)">
			@if (!skeleton) {
				<ng-content />
			}
		</cds-selectable-tag>
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TagSelectableComponent {
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() skeleton = false;
	@Input() disabled = false;
	@Input() selected = false;

	@Output() selectedChange = new EventEmitter<boolean>();

	onSelected(event: Event) {
		this.selected = (event as CustomEvent<{ selected: boolean }>).detail.selected;
		this.selectedChange.emit(this.selected);
	}
}
