import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/search/index.js";
import { I18n } from "carbon-components-angular/i18n";
import { observeAttributes, provideValueAccessor, WebComponentValueAccessor } from "carbon-components-angular/utils";

/**
 * Adds Angular inputs and outputs to the `<cds-search>` web component. Works with `ngModel` / reactive forms.
 *
 * [See demo](../../?path=/story/components-search--basic)
 */
@Component({
	selector: "cds-search",
	template: `<ng-content />`,
	host: {
		"[id]": "id",
		"[name]": "name",
		"[value]": "value ?? ''",
		"[size]": "size",
		"[disabled]": "disabled",
		"[expandable]": "expandable || toolbar",
		"[expanded]": "active",
		"[autoComplete]": "autocomplete",
		"[labelText]": "label",
		"[placeholder]": "placeholder",
		"[closeButtonLabelText]": "clearButtonTitle",
		"[attr.aria-label]": "ariaLabel",
		"(cds-search-input)": "onSearch($event)",
		"(keydown)": "onKeydown($event)"
	},
	providers: [provideValueAccessor(() => Search)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Search extends WebComponentValueAccessor<string> {
	static searchCount = 0;

	public i18n = inject(I18n);

	@Input() size: "sm" | "md" | "lg" = "md";
	/**
	 * Collapses to an icon button until focused.
	 */
	@Input({ transform: booleanAttribute }) expandable = false;
	/**
	 * @deprecated use `expandable`.
	 */
	@Input({ transform: booleanAttribute }) toolbar = false;
	/**
	 * Whether an expandable search is open.
	 */
	@Input({ transform: booleanAttribute }) active = false;
	@Input() name: string;
	@Input() id = `search-${Search.searchCount++}`;
	@Input({ transform: booleanAttribute }) required: boolean;
	@Input() value = "";
	@Input() autocomplete = "on";
	@Input() label = this.i18n.get().SEARCH.LABEL;
	@Input() placeholder = this.i18n.get().SEARCH.PLACEHOLDER;
	@Input() clearButtonTitle = this.i18n.get().SEARCH.CLEAR_BUTTON;
	@Input() ariaLabel: string;
	/**
	 * @deprecated the web component follows the surrounding theme / layer.
	 */
	@Input() theme: "light" | "dark" = "dark";
	/**
	 * @deprecated use `<cds-search-skeleton>` instead.
	 */
	@Input({ transform: booleanAttribute }) skeleton = false;
	/**
	 * @deprecated
	 */
	@Input({ transform: booleanAttribute }) tableSearch = false;
	/**
	 * @deprecated
	 */
	@Input() searchTitle = "";
	/**
	 * @deprecated use `<cds-fluid-search>`.
	 */
	@Input({ transform: booleanAttribute }) fluid = false;

	@Output() valueChange = new EventEmitter<string>();
	/**
	 * Emits `active` when an expandable search opens or closes.
	 */
	@Output() open = new EventEmitter<boolean>();
	/**
	 * Supports two-way binding with `active`.
	 */
	@Output() activeChange = new EventEmitter<boolean>();
	@Output() clear = new EventEmitter();
	/**
	 * Emits the value when Enter is pressed.
	 */
	@Output() search = new EventEmitter<string>();

	constructor() {
		super();
		// The web component expands / collapses itself (magnifier click, Escape, focus out)
		// through its reflected `expanded` attribute; mirror that into `active` and `open`.
		observeAttributes(this.element, ["expanded"], () => {
			const expanded = this.element.expanded;
			if (expanded !== this.active) {
				this.active = expanded;
				this.open.emit(expanded);
				this.activeChange.emit(expanded);
				this.changeDetectorRef.markForCheck();
			}
		});
	}

	writeValue(value: string) {
		this.value = value;
		this.changeDetectorRef.markForCheck();
	}

	onSearch(event: Event) {
		const value = (event as CustomEvent<{ value: string }>).detail.value;
		const cleared = !value && !!this.value;
		this.value = value;
		this.onChange(value);
		this.valueChange.emit(value);
		if (cleared) {
			this.clear.emit();
		}
	}

	onKeydown(event: KeyboardEvent) {
		if (event.key === "Enter") {
			this.search.emit(this.value);
		}
	}
}
