import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/multi-select/index.js";
import { I18n } from "carbon-components-angular/i18n";
import { provideValueAccessor, TemplateContent, TemplateSlot } from "carbon-components-angular/utils";
import { ListSelection } from "./list-selection.class";
import { ListItem } from "./list-item.interface";
import { DropdownItem, MultiSelectItem } from "./dropdown-item.component";

/**
 * Inputs and host bindings shared by `Dropdown` and `MultiSelect`.
 */
@Directive({
	host: {
		"[id]": "id",
		"[titleText]": "isTemplate(label) ? '' : (label ?? element.titleText)",
		"[label]": "placeholder ?? element.label",
		"[hideLabel]": "hideLabel ?? element.hideLabel",
		"[helperText]": "isTemplate(helperText) ? '' : (helperText ?? element.helperText)",
		"[size]": "size ?? element.size",
		"[disabled]": "disabled ?? element.disabled",
		"[readOnly]": "readonly ?? element.readOnly",
		"[type]": "inline === undefined ? element.type : (inline ? 'inline' : '')",
		"[direction]": "dropUp === undefined ? element.direction : (dropUp ? 'top' : 'bottom')",
		"[open]": "isOpen ?? element.open",
		"[invalid]": "invalid ?? element.invalid",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"[warn]": "warn ?? element.warn",
		"[warnText]": "content.render('warnText', warnText)",
		"[toggleLabelClosed]": "menuButtonLabel",
		"[isFluid]": "fluid ?? element.isFluid"
	}
})
export abstract class BaseDropdown extends ListSelection {
	static dropdownCount = 0;

	public i18n = inject(I18n);

	@Input() id = `dropdown-${BaseDropdown.dropdownCount++}`;
	@Input() label: string | TemplateRef<any>;
	@Input({ transform: booleanAttribute }) hideLabel?: boolean;
	@Input() helperText: string | TemplateRef<any>;
	@Input() decorator: TemplateRef<any>;
	/**
	 * Text shown in the trigger when nothing is selected.
	 */
	@Input() placeholder?: string;
	/**
	 * The web component's default is `"md"`.
	 */
	@Input() size?: "sm" | "md" | "lg";
	@Input({ transform: booleanAttribute }) readonly?: boolean;
	@Input({ transform: booleanAttribute }) inline?: boolean;
	@Input({ transform: booleanAttribute }) fluid?: boolean;
	@Input({ transform: booleanAttribute }) invalid?: boolean;
	@Input() invalidText: string | TemplateRef<any>;
	@Input({ transform: booleanAttribute }) warn?: boolean;
	@Input() warnText: string | TemplateRef<any>;
	/**
	 * Opens the menu upwards.
	 */
	@Input({ transform: booleanAttribute }) dropUp?: boolean;
	/**
	 * Unset, the web component keeps its own open state.
	 */
	@Input({ transform: booleanAttribute }) isOpen?: boolean;
	@Input() menuButtonLabel = this.i18n.get().DROPDOWN.OPEN;
	@Input() clearText: string = this.i18n.get().DROPDOWN.CLEAR;
	@Input() selectedLabel = this.i18n.get().DROPDOWN.SELECTED;
	/**
	 * @deprecated the web component shows the selected item's content.
	 */
	@Input() displayValue: string | TemplateRef<any> = "";
	/**
	 * @deprecated the web component follows the surrounding theme / layer.
	 */
	@Input() theme: "light" | "dark" = "dark";
	/**
	 * @deprecated the web component positions its own menu.
	 */
	@Input() appendInline: boolean = null;
	/**
	 * @deprecated the web component positions its own menu.
	 */
	@Input() scrollableContainer: string;
	/**
	 * @deprecated the web component handles keyboard navigation.
	 */
	@Input({ transform: booleanAttribute }) disableArrowKeys = false;

	// eslint-disable-next-line @angular-eslint/no-output-on-prefix -- existing output name
	@Output() onClose = new EventEmitter<any>();
	@Output() close = new EventEmitter<any>();

	protected element = inject(ElementRef).nativeElement;
	protected content = new TemplateContent();

	onToggled(event: Event) {
		this.isOpen = (event as CustomEvent<{ open: boolean }>).detail.open;
		if (!this.isOpen) {
			this.onClose.emit();
			this.close.emit();
		}
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}

	/**
	 * A disabled dropdown closes its menu (and keeps its selection).
	 */
	protected onDisabledChange() {
		if (this.disabled) {
			this.isOpen = false;
		}
	}
}

const SLOTS = `
	<ng-container cdsSlot="title-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
	<ng-container cdsSlot="helper-text" [cdsSlotTemplate]="isTemplate(helperText) ? helperText : null" />
	<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="decorator" />
`;

// The web components copy the item's text (selected label), so no whitespace around it.
const ITEM_CONTENT = `@if (listTpl) {<ng-template [ngTemplateOutlet]="listTpl" [ngTemplateOutletContext]="{ item: item }" />} @else {{{ item.content }}}`;

/**
 * Adds Angular inputs and outputs to the `<cds-dropdown>` web component (single selection). Works with `ngModel` / reactive forms.
 *
 * ```html
 * <cds-dropdown label="Pick one" [(ngModel)]="value" itemValueKey="id">
 * 	<cds-dropdown-list [items]="items" />
 * </cds-dropdown>
 * ```
 *
 * For multiple selection use `<cds-multi-select>`: a `cds-dropdown` element is always
 * the single-select web component.
 *
 * [See demo](../../?path=/story/components-dropdown--basic)
 */
@Component({
	selector: "cds-dropdown",
	template: `
		${SLOTS}
		<ng-content />
		@for (item of items; track $index) {
			<cds-dropdown-item [value]="'' + $index" [attr.data-list-index]="$index" [disabled]="!!item.disabled" [selected]="!!item.selected"
				>${ITEM_CONTENT}</cds-dropdown-item
			>
		}
	`,
	host: {
		"[value]": "selectedIndex",
		"(cds-dropdown-selected)": "onSelected($event)",
		"(cds-dropdown-toggled)": "onToggled($event)"
	},
	providers: [provideValueAccessor(() => Dropdown)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, TemplateSlot, DropdownItem],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Dropdown extends BaseDropdown {
	/**
	 * @deprecated use `<cds-multi-select>` for multiple selection.
	 */
	@Input() type: "single" | "multi" = "single";
	/**
	 * @deprecated only applies to `<cds-multi-select>`.
	 */
	@Input() selectionFeedback: "top" | "fixed" | "top-after-reopen" = "top-after-reopen";

	get multiple() {
		return false;
	}

	get selectedIndex() {
		const index = this._items.findIndex(item => item.selected);
		return index < 0 ? this.childValue : String(index);
	}

	onSelected(event: Event) {
		const item = (event as CustomEvent<{ item: Element & { value: string } }>).detail.item;
		if (this.isListItem(item)) {
			this.select([Number(item.value)]);
		} else {
			this.selectChildren([item]);
		}
	}
}

/**
 * Adds Angular inputs and outputs to the `<cds-multi-select>` web component. Works with `ngModel` / reactive forms;
 * the value is an array. Set `filterable` for a multi-select combo box.
 *
 * ```html
 * <cds-multi-select label="Pick some" [(ngModel)]="values">
 * 	<cds-dropdown-list [items]="items" />
 * </cds-multi-select>
 * ```
 *
 * [See demo](../../?path=/story/components-dropdown--multi-select)
 */
@Component({
	selector: "cds-multi-select",
	template: `
		${SLOTS}
		<ng-content />
		@for (item of displayItems; track item) {
			<cds-multi-select-item [value]="'' + items.indexOf(item)" [attr.data-list-index]="items.indexOf(item)" [disabled]="!!item.disabled" [selected]="!!item.selected"
				>${ITEM_CONTENT}</cds-multi-select-item
			>
		}
	`,
	host: {
		"[value]": "selectedValues",
		"[filterable]": "filterable ?? element.filterable",
		// The web component reorders by replacing its children, which Angular owns, so the
		// wrapper orders the items itself (see `displayItems`).
		"[selectionFeedback]": "'fixed'",
		"[clearSelectionLabel]": "clearText",
		"(cds-multi-select-selected)": "onSelected()",
		"(cds-multi-select-toggled)": "onToggled($event)"
	},
	providers: [provideValueAccessor(() => MultiSelect)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, TemplateSlot, MultiSelectItem],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MultiSelect extends BaseDropdown {
	/**
	 * Lets the user type to filter the items.
	 */
	@Input({ transform: booleanAttribute }) filterable?: boolean;
	/**
	 * Where selected items appear in the list.
	 */
	@Input() selectionFeedback: "top" | "fixed" | "top-after-reopen" = "top-after-reopen";

	protected reopenOrder: ListItem[] | null = null;

	get multiple() {
		return true;
	}

	/**
	 * The web component's value: selected item values joined with commas.
	 */
	get selectedValues() {
		return this._items.map((item, index) => item.selected ? String(index) : null).filter(Boolean).join(",") || this.childValue;
	}

	/**
	 * The items in display order: with `top`, selected items come first; with `top-after-reopen`,
	 * the order is updated each time the menu opens.
	 */
	get displayItems(): ListItem[] {
		if (this.selectionFeedback === "top") {
			return this.selectedFirst();
		}
		if (this.selectionFeedback === "top-after-reopen" && this.reopenOrder) {
			const kept = this.reopenOrder.filter(item => this._items.includes(item));
			return [...kept, ...this._items.filter(item => !kept.includes(item))];
		}
		return this._items;
	}

	onToggled(event: Event) {
		super.onToggled(event);
		if (this.isOpen) {
			this.reopenOrder = this.selectedFirst();
		}
	}

	onSelected() {
		const selected = Array.from<any>(this.element.querySelectorAll("cds-multi-select-item"))
			.filter(item => item.selected && !item.isSelectAll);
		const children = selected.filter(item => !this.isListItem(item));
		if (children.length && !this._items.length) {
			this.selectChildren(children);
		} else {
			this.select(selected.filter(item => this.isListItem(item)).map(item => Number(item.value)));
		}
	}

	private selectedFirst() {
		return [...this._items.filter(item => item.selected), ...this._items.filter(item => !item.selected)];
	}
}
