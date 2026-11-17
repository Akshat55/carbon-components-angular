import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/content-switcher/index.js";

/**
 * Adds Angular inputs and outputs to the `<cds-content-switcher>` web component. Project `cds-content-switcher-item`s.
 *
 * ```html
 * <cds-content-switcher (selected)="onSelected($event)">
 * 	<cds-content-switcher-item name="first">First</cds-content-switcher-item>
 * 	<cds-content-switcher-item name="second">Second</cds-content-switcher-item>
 * </cds-content-switcher>
 * ```
 *
 * `[(selectedIndex)]` tracks the selection; each item's `[(active)]` tracks its own.
 *
 * [See demo](../../?path=/story/components-content-switcher--basic)
 */
@Component({
	selector: "cds-content-switcher",
	template: "<ng-content />",
	host: {
		"[size]": "size ?? element.size",
		"[lowContrast]": "lowContrast ?? element.lowContrast",
		"[selectionMode]": "selectionMode ?? element.selectionMode",
		"[selectedIndex]": "selectedIndex ?? element.selectedIndex",
		"[attr.aria-label]": "ariaLabel",
		"(cds-content-switcher-selected)": "onSelected($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContentSwitcher {
	@Input() ariaLabel = "content switcher";
	/**
	 * Unset, the items use `"md"`.
	 */
	@Input() size?: "sm" | "md" | "lg";
	@Input({ transform: booleanAttribute }) lowContrast?: boolean;
	/**
	 * The web component's default is `"automatic"`.
	 */
	@Input() selectionMode?: "automatic" | "manual";
	/**
	 * Index of the selected option. Without it, an option marked `active` (or the first) is selected.
	 */
	@Input() selectedIndex: number | undefined;

	/**
	 * Emits the selected `cds-content-switcher-item` element after a user selects it.
	 */
	@Output() selected = new EventEmitter<HTMLElement>();
	@Output() selectedIndexChange = new EventEmitter<number>();

	protected element: any = inject(ElementRef).nativeElement;

	onSelected(event: Event) {
		const { item, index } = (event as CustomEvent<{ item: HTMLElement, index: number }>).detail;
		this.selectedIndex = index;
		this.selectedIndexChange.emit(index);
		this.selected.emit(item);
	}
}
