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
import "@carbon/web-components/es/components/menu/index.js";

/**
 * Adds Angular inputs and outputs to the `<cds-menu-item-selectable>` web component: a menu item
 * that toggles a checkmark. Importing it registers the web component.
 *
 * ```html
 * <cds-menu-item-selectable label="Bold" [(selected)]="bold" />
 * ```
 */
@Component({
	selector: "cds-menu-item-selectable",
	template: "<ng-content />",
	host: {
		"[label]": "label ?? element.label",
		"[selected]": "selected ?? element.selected",
		"(cds-item-changed)": "onChanged($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuItemSelectable {
	@Input() label: string;
	/**
	 * Supports two-way binding with `selectedChange`.
	 */
	/**
	 * Supports two-way binding with `selectedChange`. Unset, the web component keeps its own state.
	 */
	@Input({ transform: booleanAttribute }) selected?: boolean;

	@Output() selectedChange = new EventEmitter<boolean>();

	protected element: HTMLElement & { selected: boolean } = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	onChanged(event: Event) {
		// The web component fires the event twice, and it bubbles from nested items.
		if (event.currentTarget !== this.element || this.element.selected === !!this.selected) {
			return;
		}
		this.selected = this.element.selected;
		this.selectedChange.emit(this.selected);
		this.changeDetectorRef.markForCheck();
	}
}

/**
 * Adds Angular inputs and outputs to the `<cds-menu-item-radio-group>` web component: a group of
 * `cds-menu-item`s of which one is checked. Importing it registers the web component.
 *
 * ```html
 * <cds-menu-item-radio-group label="Size" [(selected)]="size">
 * 	<cds-menu-item label="Small" />
 * 	<cds-menu-item label="Large" />
 * </cds-menu-item-radio-group>
 * ```
 *
 * `selected` is the `label` of the checked item.
 */
@Component({
	selector: "cds-menu-item-radio-group",
	template: "<ng-content />",
	host: {
		"[label]": "label ?? element.label",
		"[selectedItem]": "selectedItem",
		"(cds-item-changed)": "onChanged($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuItemRadioGroup {
	/**
	 * Accessible label of the group.
	 */
	@Input() label: string;
	/**
	 * The `label` of the checked item. Supports two-way binding with `selectedChange`.
	 */
	@Input() selected: string;

	@Output() selectedChange = new EventEmitter<string>();

	protected element: HTMLElement & { selectedItem: Element } = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	/**
	 * The item element the web component marks as checked.
	 */
	get selectedItem() {
		if (this.selected === undefined) {
			return this.element.selectedItem;
		}
		return Array.from<any>(this.element.querySelectorAll("cds-menu-item"))
			.find(item => item.label === this.selected) ?? null;
	}

	onChanged(event: Event) {
		const item = (event as CustomEvent<{ triggeredBy: Element & { label: string } }>).detail.triggeredBy;
		const label = item?.closest?.("cds-menu-item")?.["label"];
		if (event.currentTarget !== this.element || label === undefined || label === this.selected) {
			return;
		}
		this.selected = label;
		this.selectedChange.emit(label);
		this.changeDetectorRef.markForCheck();
	}
}
