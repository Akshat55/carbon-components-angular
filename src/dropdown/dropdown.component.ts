import {
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

/**
 * Inputs and host bindings shared by `Dropdown` and `MultiSelect`.
 */
@Directive({
	host: {
		"[id]": "id",
		"[titleText]": "isTemplate(label) ? '' : label",
		"[label]": "placeholder",
		"[hideLabel]": "hideLabel",
		"[helperText]": "isTemplate(helperText) ? '' : helperText",
		"[size]": "size",
		"[disabled]": "disabled",
		"[readOnly]": "readonly",
		"[type]": "inline ? 'inline' : ''",
		"[direction]": "dropUp ? 'top' : 'bottom'",
		"[open]": "isOpen",
		"[invalid]": "invalid",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"[warn]": "warn",
		"[warnText]": "content.render('warnText', warnText)",
		"[toggleLabelClosed]": "menuButtonLabel",
		"[isFluid]": "fluid"
	}
})
export abstract class BaseDropdown extends ListSelection {
	static dropdownCount = 0;

	public i18n = inject(I18n);

	@Input() id = `dropdown-${BaseDropdown.dropdownCount++}`;
	@Input() label: string | TemplateRef<any>;
	@Input() hideLabel = false;
	@Input() helperText: string | TemplateRef<any>;
	@Input() decorator: TemplateRef<any>;
	/**
	 * Text shown in the trigger when nothing is selected.
	 */
	@Input() placeholder = "";
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() readonly = false;
	@Input() inline = false;
	@Input() fluid = false;
	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;
	/**
	 * Opens the menu upwards.
	 */
	@Input() dropUp: boolean;
	@Input() isOpen = false;
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
	 * @deprecated use `<cds-dropdown-skeleton>` instead.
	 */
	@Input() skeleton = false;
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
	@Input() disableArrowKeys = false;

	// eslint-disable-next-line @angular-eslint/no-output-on-prefix -- existing output name
	@Output() onClose = new EventEmitter<any>();
	@Output() close = new EventEmitter<any>();

	protected element = inject(ElementRef).nativeElement;
	protected content = new TemplateContent();

	/**
	 * A disabled dropdown closes its menu (and keeps its selection).
	 */
	protected onDisabledChange() {
		if (this.disabled) {
			this.isOpen = false;
		}
	}

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
}

const SLOTS = `
	<ng-container cdsSlot="title-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
	<ng-container cdsSlot="helper-text" [cdsSlotTemplate]="isTemplate(helperText) ? helperText : null" />
	<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="decorator" />
`;

const ITEM_CONTENT = `
	@if (listTpl) {
		<ng-template [ngTemplateOutlet]="listTpl" [ngTemplateOutletContext]="{ item: item }" />
	} @else {
		{{ item.content }}
	}
`;

/**
 * Wraps the `<cds-dropdown>` web component (single selection). Works with `ngModel` / reactive forms.
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
		@for (item of items; track $index) {
			<cds-dropdown-item [value]="'' + $index" [disabled]="!!item.disabled" [selected]="!!item.selected">
				${ITEM_CONTENT}
			</cds-dropdown-item>
		}
	`,
	host: {
		"[value]": "selectedIndex",
		"(cds-dropdown-selected)": "onSelected($event)",
		"(cds-dropdown-toggled)": "onToggled($event)"
	},
	providers: [provideValueAccessor(() => Dropdown)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, TemplateSlot],
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
		return index < 0 ? "" : String(index);
	}

	onSelected(event: Event) {
		const value = (event as CustomEvent<{ item: { value: string } }>).detail.item.value;
		this.select([Number(value)]);
	}
}

/**
 * Wraps the `<cds-multi-select>` web component. Works with `ngModel` / reactive forms;
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
		@for (item of items; track $index) {
			<cds-multi-select-item [value]="'' + $index" [disabled]="!!item.disabled" [selected]="!!item.selected">
				${ITEM_CONTENT}
			</cds-multi-select-item>
		}
	`,
	host: {
		"[value]": "selectedValues",
		"[filterable]": "filterable",
		"[selectionFeedback]": "selectionFeedback",
		"[clearSelectionLabel]": "clearText",
		"(cds-multi-select-selected)": "onSelected()",
		"(cds-multi-select-toggled)": "onToggled($event)"
	},
	providers: [provideValueAccessor(() => MultiSelect)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MultiSelect extends BaseDropdown {
	/**
	 * Lets the user type to filter the items.
	 */
	@Input() filterable = false;
	/**
	 * Where selected items appear in the list.
	 */
	@Input() selectionFeedback: "top" | "fixed" | "top-after-reopen" = "top-after-reopen";

	get multiple() {
		return true;
	}

	/**
	 * The web component's value: selected item values joined with commas.
	 */
	get selectedValues() {
		return this._items.map((item, index) => item.selected ? String(index) : null).filter(Boolean).join(",");
	}

	onSelected() {
		const elements = Array.from<any>(this.element.querySelectorAll("cds-multi-select-item"));
		this.select(elements.filter(item => item.selected).map(item => Number(item.value)));
	}
}
