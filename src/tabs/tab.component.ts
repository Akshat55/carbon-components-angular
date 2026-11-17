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
import "@carbon/web-components/es/components/tabs/index.js";
import { observeAttributes } from "carbon-components-angular/utils";

/**
 * Adds Angular inputs and outputs to the `<cds-tab>` web component: one tab in a `cds-tabs`.
 * Importing it registers the web component.
 *
 * The tab is only the header. Point `target` at the `id` of the panel it shows; the web
 * component toggles that panel's `hidden` attribute.
 *
 * ```html
 * <cds-tab target="panel-1">First</cds-tab>
 * ```
 *
 * [See demo](../../?path=/story/components-tabs--basic)
 */
@Component({
	selector: "cds-tab",
	template: "<ng-content />",
	host: {
		"[id]": "id",
		"[value]": "value",
		"[target]": "target",
		"[selected]": "active",
		// `cds-tabs` picks its initial tab by the `selected` attribute, before the tab reflects it
		"[attr.selected]": "active ? '' : null",
		"[disabled]": "disabled",
		"[iconOnly]": "iconOnly",
		"[attr.aria-label]": "ariaLabel || null",
		"[secondaryLabel]": "secondaryLabel",
		"[badgeIndicator]": "badgeIndicator",
		"(cds-tab-closed)": "tabClose.emit()"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab {
	private static counter = 0;

	@Input() id = `tab-${Tab.counter++}`;
	/**
	 * Identifies the tab in `cds-tabs`' `value`. Defaults to the `id`.
	 */
	@Input() set value(value: string) {
		this._value = value;
	}
	get value() {
		return this._value ?? this.id;
	}
	/**
	 * The `id` of the panel this tab shows.
	 */
	@Input() target: string;
	/**
	 * Selects this tab (`cds-tabs`' `value` does the same). Supports two-way binding with
	 * `activeChange`.
	 */
	@Input({ transform: booleanAttribute }) active = false;
	@Input({ transform: booleanAttribute }) disabled = false;
	/**
	 * Set to `true` for a tab with only an icon. Give it an `ariaLabel`, which is also its tooltip.
	 */
	@Input({ transform: booleanAttribute }) iconOnly = false;
	/**
	 * Accessible label for tabs without text (and the tooltip of icon-only tabs).
	 */
	@Input() ariaLabel: string;
	/**
	 * Second line of text (contained tabs).
	 */
	@Input() secondaryLabel: string;
	@Input({ transform: booleanAttribute }) badgeIndicator = false;

	/**
	 * Emits when the tab becomes selected.
	 */
	@Output() selected = new EventEmitter<void>();
	@Output() activeChange = new EventEmitter<boolean>();
	/**
	 * Emits when the close button of a tab in `dismissable` tabs is clicked.
	 * Remove the tab (and its panel) in response.
	 */
	@Output() tabClose = new EventEmitter<void>();

	readonly element: any = inject(ElementRef).nativeElement;
	protected changeDetectorRef = inject(ChangeDetectorRef);
	private _value: string;

	constructor() {
		observeAttributes(this.element, ["selected"], () => {
			const active = this.element.selected;
			if (active !== this.active) {
				this.active = active;
				this.activeChange.emit(active);
				if (active) {
					this.selected.emit();
				}
				this.changeDetectorRef.markForCheck();
			}
		});
	}
}
