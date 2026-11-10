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
 * Adds Angular inputs and `[(selected)]` to the `<cds-selectable-tag>` web component.
 *
 * ```html
 * <cds-selectable-tag text="Tag" [(selected)]="selected" />
 * ```
 *
 * [See demo](../../?path=/story/components-tag--selectable)
 */
@Component({
	selector: "cds-selectable-tag",
	template: "<ng-content />",
	host: {
		"[text]": "text",
		"[size]": "size",
		"[disabled]": "disabled",
		"[selected]": "selected",
		"(cds-selectable-tag-selected)": "onSelected($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TagSelectableComponent {
	@Input() text = "";
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() disabled = false;
	@Input() selected = false;

	@Output() selectedChange = new EventEmitter<boolean>();

	onSelected(event: Event) {
		this.selected = (event as CustomEvent<{ selected: boolean }>).detail.selected;
		this.selectedChange.emit(this.selected);
	}
}
