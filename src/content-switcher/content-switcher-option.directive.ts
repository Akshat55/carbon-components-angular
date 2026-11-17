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
import "@carbon/web-components/es/components/content-switcher/index.js";
import { observeAttributes } from "carbon-components-angular/utils";

/**
 * Adds Angular inputs and outputs to the `<cds-content-switcher-item>` web component.
 */
@Component({
	selector: "cds-content-switcher-item",
	template: "<ng-content />",
	host: {
		"[value]": "name",
		"[disabled]": "disabled ?? element.disabled",
		"[selected]": "active",
		// The content switcher looks for `[selected]` items on its first render, before the
		// item has reflected the property.
		"[attr.selected]": "active ? '' : null",
		"(click)": "onClick.emit($event)",
		"(focus)": "onFocus.emit($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContentSwitcherOption {
	static optionCount = 0;

	/**
	 * Whether the option is selected. Supports two-way binding with `activeChange`; the web
	 * component also selects options itself.
	 */
	@Input({ transform: booleanAttribute }) active = false;

	/**
	 * The item's `value`. The web component selects items by value, so every item needs its
	 * own: unset, a unique one is generated (v6 used `"option"` for all).
	 */
	@Input() name = `content-switcher-option-${ContentSwitcherOption.optionCount++}`;
	@Input({ transform: booleanAttribute }) disabled?: boolean;

	/**
	 * Emits `true` when the option becomes selected.
	 */
	@Output() selected = new EventEmitter<boolean>();
	@Output() activeChange = new EventEmitter<boolean>();
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() onClick = new EventEmitter<MouseEvent>();
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() onFocus = new EventEmitter<FocusEvent>();

	readonly element: any = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);

	constructor() {
		observeAttributes(this.element, ["selected"], () => {
			const active = this.element.selected;
			if (active !== this.active) {
				this.active = active;
				this.activeChange.emit(active);
				if (active) {
					this.selected.emit(true);
				}
				this.changeDetectorRef.markForCheck();
			}
		});
	}
}
