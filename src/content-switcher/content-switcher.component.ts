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
import "@carbon/web-components/es/components/content-switcher/index.js";
import { ContentSwitcherOption } from "./content-switcher-option.directive";

/**
 * Wraps the `<cds-content-switcher>` web component. Project `cds-content-switcher-item`s.
 *
 * ```html
 * <cds-content-switcher (selected)="onSelected($event)">
 * 	<cds-content-switcher-item name="first">First</cds-content-switcher-item>
 * 	<cds-content-switcher-item name="second">Second</cds-content-switcher-item>
 * </cds-content-switcher>
 * ```
 *
 * v6 `<button cdsContentOption>` options must become `<cds-content-switcher-item>`.
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
export class ContentSwitcher implements AfterContentInit {
	@Input() ariaLabel = "content switcher";
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() lowContrast = false;
	@Input() selectionMode: "automatic" | "manual" = "automatic";
	/**
	 * Index of the selected option.
	 */
	@Input() selectedIndex: number | undefined;

	/**
	 * Emits the selected option.
	 */
	@Output() selected = new EventEmitter<ContentSwitcherOption>();

	@ContentChildren(ContentSwitcherOption) options: QueryList<ContentSwitcherOption>;

	ngAfterContentInit() {
		const index = this.selectedIndex ?? this.options.toArray().findIndex(option => option.active);
		this.options.forEach((option, i) => option.active = i === Math.max(index, 0));
	}

	onSelected(event: Event) {
		const element = (event as CustomEvent<{ item: Element }>).detail.item;
		const option = this.options.find(o => o.element === element);
		if (option) {
			this.options.forEach(o => o.active = o === option);
			option.selected.emit(true);
			this.selected.emit(option);
		}
	}
}
