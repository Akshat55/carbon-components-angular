import {
	AfterContentInit,
	ContentChild,
	Directive,
	EventEmitter,
	Input,
	OnDestroy,
	Output,
	TemplateRef
} from "@angular/core";
import { Subscription } from "rxjs";
import { WebComponentValueAccessor } from "carbon-components-angular/utils";
import { DropdownList } from "./list/dropdown-list.component";
import { ListItem } from "./list-item.interface";

/**
 * Shared selection model for the list box wrappers (`cds-dropdown`, `cds-multi-select`, `cds-combo-box`).
 *
 * Items come from `[items]` or a projected `<cds-dropdown-list [items]>`. Each `ListItem` is rendered as a
 * web component item whose value is its index, so selections map straight back to the `ListItem`.
 *
 * The form value is the selected `ListItem` (or `item[itemValueKey]`), or an array of them when `multiple`.
 */
@Directive()
export abstract class ListSelection extends WebComponentValueAccessor implements AfterContentInit, OnDestroy {
	/**
	 * Items to choose from. A projected `cds-dropdown-list` can provide them instead.
	 */
	@Input() set items(items: ListItem[]) {
		this._items = items ?? [];
		this.applyValue();
		// Projected lists and observable item sources update outside this component's inputs.
		this.changeDetectorRef.markForCheck();
	}
	get items() {
		return this._items;
	}
	/**
	 * When set, the form value is `item[itemValueKey]` instead of the whole `ListItem`.
	 */
	@Input() itemValueKey: string;
	/**
	 * Set to `true` to write `null` to the form instead of clearing the selection.
	 */
	@Input() allowNullValues = false;

	/**
	 * Emits `{ item, isUpdate: false }` for single selection, or the selected `ListItem[]` when multiple.
	 */
	@Output() selected = new EventEmitter<any>();

	@ContentChild(DropdownList) list: DropdownList;

	protected _items: ListItem[] = [];
	protected written: any;
	private listSubscription: Subscription;

	abstract get multiple(): boolean;

	/**
	 * Template for item content, from the projected `cds-dropdown-list`.
	 */
	get listTpl(): TemplateRef<any> | null {
		return this.list?.listTpl instanceof TemplateRef ? this.list.listTpl : null;
	}

	get selectedItems() {
		return this._items.filter(item => item.selected);
	}

	ngAfterContentInit() {
		// The list only supplies items when it was given some; v6 combo boxes take `[items]`
		// on the combo box and project an empty `<cds-dropdown-list />`.
		if (this.list && this.list.items !== undefined) {
			this.listSubscription = this.list.items$.subscribe(items => this.items = items);
		}
	}

	ngOnDestroy() {
		this.listSubscription?.unsubscribe();
	}

	writeValue(value: any) {
		this.written = value;
		this.applyValue();
		this.changeDetectorRef.markForCheck();
	}

	/**
	 * Selects the items at `indexes` (from the web component) and notifies the form and `selected`.
	 */
	protected select(indexes: number[]) {
		this._items.forEach((item, index) => item.selected = indexes.includes(index));
		const model = this.toModel();
		this.written = model;
		this.onChange(model);
		this.emitSelected();
		// v6 also emitted the selection from the projected list.
		this.list?.select.emit(this.multiple ? this.selectedItems : { item: this.selectedItems[0], isUpdate: false });
		this.changeDetectorRef.markForCheck();
	}

	/**
	 * Whether `element` is an option rendered from `items` (rather than written as a child).
	 */
	protected isListItem(element: Element) {
		return element.hasAttribute("data-list-index");
	}

	/**
	 * Selects options written as children (`cds-dropdown-item` etc.). Their model is their `value`.
	 */
	protected selectChildren(options: Array<Element & { value: string }>) {
		this._items.forEach(item => item.selected = false);
		const values = options.map(option => option.value);
		this.written = this.multiple ? values : values[0] ?? null;
		this.onChange(this.written);
		const items = options.map(option => ({ content: option.textContent.trim(), value: option.value, selected: true }));
		if (this.multiple) {
			this.selected.emit(items);
		} else {
			this.emitChildSelected(items[0]);
		}
		this.changeDetectorRef.markForCheck();
	}

	protected emitChildSelected(item: ListItem | undefined) {
		this.selected.emit({ item, isUpdate: false });
	}

	/**
	 * The web component's `value` when there are no `items`: the model of the child options.
	 */
	protected get childValue(): string {
		if (this._items.length || this.written === undefined || this.written === null) {
			return "";
		}
		return Array.isArray(this.written) ? this.written.join(",") : String(this.written);
	}

	protected emitSelected() {
		if (this.multiple) {
			this.selected.emit(this.selectedItems);
		} else {
			this.selected.emit({ item: this.selectedItems[0], isUpdate: false });
		}
	}

	protected toModel() {
		const values = this.selectedItems.map(item => this.itemValueKey ? item[this.itemValueKey] : item);
		return this.multiple ? values : values[0] ?? null;
	}

	/**
	 * Marks the items matching the written form value as selected.
	 */
	protected applyValue() {
		if (this.written === undefined) {
			return;
		}
		const values = this.multiple ? (this.written ?? []) : [this.written];
		const matches = (item: ListItem, value: any) =>
			this.itemValueKey ? item[this.itemValueKey] === value : item === value || (!!value && item.content === value.content);
		this._items.forEach(item => item.selected = values.some(value => (value !== null || this.allowNullValues) && matches(item, value)));
	}
}
