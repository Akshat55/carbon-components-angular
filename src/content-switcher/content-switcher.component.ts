import {
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
import { wrapperOf } from "carbon-components-angular/utils";
import { ContentSwitcherOption } from "./content-switcher-option.directive";

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
 * The options are read from the DOM, so options created any way (templates, `@for`,
 * `createComponent`) work. `[(selectedIndex)]` tracks the selection.
 *
 * [See demo](../../?path=/story/components-content-switcher--basic)
 */
@Component({
	selector: "cds-content-switcher",
	template: "<ng-content />",
	host: {
		"[size]": "size",
		"[lowContrast]": "lowContrast",
		"[selectionMode]": "selectionMode",
		"[selectedIndex]": "selectedIndex ?? 0",
		"[attr.aria-label]": "ariaLabel",
		"(cds-content-switcher-selected)": "onSelected($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContentSwitcher {
	@Input() ariaLabel = "content switcher";
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() lowContrast = false;
	@Input() selectionMode: "automatic" | "manual" = "automatic";
	/**
	 * Index of the selected option. Without it, an option marked `active` (or the first) is selected.
	 */
	@Input() selectedIndex: number | undefined;

	/**
	 * Emits the selected option (`null` if it has no Angular instance).
	 */
	@Output() selected = new EventEmitter<ContentSwitcherOption | null>();
	@Output() selectedIndexChange = new EventEmitter<number>();

	protected element: HTMLElement = inject(ElementRef).nativeElement;

	/**
	 * The Angular options, in DOM order.
	 */
	get options(): ContentSwitcherOption[] {
		return Array.from(this.element.querySelectorAll("cds-content-switcher-item"))
			.map(item => wrapperOf(item, ContentSwitcherOption))
			.filter(option => !!option);
	}

	onSelected(event: Event) {
		const { item, index } = (event as CustomEvent<{ item: Element, index: number }>).detail;
		this.options.forEach(option => option.active = option.element === item);
		const option = wrapperOf(item, ContentSwitcherOption);
		option?.selected.emit(true);
		this.selectedIndex = index;
		this.selectedIndexChange.emit(index);
		this.selected.emit(option);
	}
}
