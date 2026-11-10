import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Observable, Subscription } from "rxjs";
import "@carbon/web-components/es/components/combo-box/index.js";
import { ListItem, ListSelection } from "carbon-components-angular/dropdown";
import { I18n, Overridable } from "carbon-components-angular/i18n";
import { provideValueAccessor, TemplateContent, TemplateSlot } from "carbon-components-angular/utils";

/**
 * Wraps the `<cds-combo-box>` web component (single selection with filtering).
 * Works with `ngModel` / reactive forms.
 *
 * ```html
 * <cds-combo-box label="Pick one" [items]="items" [(ngModel)]="value">
 * 	<cds-dropdown-list />
 * </cds-combo-box>
 * ```
 *
 * For multiple selection use `<cds-multi-select filterable>`.
 *
 * [See demo](../../?path=/story/components-combobox--basic)
 */
@Component({
	selector: "cds-combo-box",
	template: `
		<ng-container cdsSlot="title-text" [cdsSlotTemplate]="isTemplate(label) ? label : null" />
		<ng-container cdsSlot="helper-text" [cdsSlotTemplate]="isTemplate(helperText) ? helperText : null" />
		<ng-container cdsSlot="ai-label" [cdsSlotTemplate]="decorator" />
		@for (item of items; track $index) {
			<cds-combo-box-item [value]="'' + $index" [disabled]="!!item.disabled" [selected]="!!item.selected">
				@if (listTpl) {
					<ng-template [ngTemplateOutlet]="listTpl" [ngTemplateOutletContext]="{ item: item }" />
				} @else {
					{{ item.content }}
				}
			</cds-combo-box-item>
		}
	`,
	host: {
		"[id]": "id",
		"[titleText]": "isTemplate(label) ? '' : label",
		"[label]": "texts.placeholder",
		"[hideLabel]": "hideLabel",
		"[helperText]": "isTemplate(helperText) ? '' : helperText",
		"[value]": "selectedIndex",
		"[size]": "size",
		"[disabled]": "disabled",
		"[readOnly]": "readonly",
		"[direction]": "dropUp ? 'top' : 'bottom'",
		"[invalid]": "invalid",
		"[invalidText]": "content.render('invalidText', invalidText)",
		"[warn]": "warn",
		"[warnText]": "content.render('warnText', warnText)",
		"[isFluid]": "fluid",
		"[toggleLabelClosed]": "texts.openMenuAria",
		"[toggleLabelOpen]": "texts.closeMenuAria",
		"[clearSelectionLabel]": "texts.clearSelectionAria",
		"(cds-combo-box-selected)": "onSelected($event)",
		"(cds-combo-box-toggled)": "onToggled($event)",
		"(input)": "onInput($event)",
		"(keydown.enter)": "onEnter($event)"
	},
	providers: [provideValueAccessor(() => ComboBox)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComboBox extends ListSelection {
	static comboBoxCount = 0;

	public i18n = inject(I18n);

	@Input() set placeholder(value: string | Observable<string>) {
		this.override("placeholder", this._placeholder, value);
	}
	get placeholder() {
		return this._placeholder.value;
	}
	@Input() set openMenuAria(value: string | Observable<string>) {
		this.override("openMenuAria", this._openMenuAria, value);
	}
	get openMenuAria() {
		return this._openMenuAria.value;
	}
	@Input() set closeMenuAria(value: string | Observable<string>) {
		this.override("closeMenuAria", this._closeMenuAria, value);
	}
	get closeMenuAria() {
		return this._closeMenuAria.value;
	}
	@Input() set clearSelectionAria(value: string | Observable<string>) {
		this.override("clearSelectionAria", this._clearSelectionAria, value);
	}
	get clearSelectionAria() {
		return this._clearSelectionAria.value;
	}
	/**
	 * @deprecated only applies to multiple selection; see `<cds-multi-select>`.
	 */
	@Input() clearSelectionsTitle: string | Observable<string>;
	/**
	 * @deprecated only applies to multiple selection; see `<cds-multi-select>`.
	 */
	@Input() clearSelectionsAria: string | Observable<string>;
	/**
	 * @deprecated the web component's clear button uses `clearSelectionAria`.
	 */
	@Input() clearSelectionTitle: string | Observable<string>;

	@Input() id = `combobox-${ComboBox.comboBoxCount++}`;
	@Input() labelId = `combobox-label-${ComboBox.comboBoxCount++}`;
	/**
	 * @deprecated use `<cds-multi-select filterable>` for multiple selection.
	 */
	@Input() type: "single" | "multi" = "single";
	@Input() size: "sm" | "md" | "lg" = "md";
	@Input() label: string | TemplateRef<any>;
	@Input() hideLabel = false;
	@Input() helperText: string | TemplateRef<any>;
	@Input() decorator: TemplateRef<any>;
	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;
	@Input() readonly = false;
	@Input() fluid = false;
	/**
	 * Opens the menu upwards.
	 */
	@Input() dropUp: boolean;
	/**
	 * @deprecated the web component positions its own menu.
	 */
	@Input() appendInline: boolean = null;
	/**
	 * @deprecated
	 */
	@Input() maxLength: number = null;
	/**
	 * @deprecated the web component follows the surrounding theme / layer.
	 */
	@Input() theme: "light" | "dark" = "dark";
	/**
	 * @deprecated only applies to multiple selection.
	 */
	@Input() selectionFeedback: "top" | "fixed" | "top-after-reopen" = "top-after-reopen";
	/**
	 * @deprecated
	 */
	@Input() autocomplete = "list";

	/**
	 * Emits when Enter is pressed with text that matches no item.
	 */
	// eslint-disable-next-line @angular-eslint/no-output-native
	@Output() submit = new EventEmitter<{ items: ListItem[], index: number, value: { content: string, selected: boolean } }>();
	@Output() close = new EventEmitter<void>();
	/**
	 * Emits the text typed in the input.
	 */
	@Output() search = new EventEmitter<string>();
	@Output() clear = new EventEmitter<Event>();

	/**
	 * Current values of the translatable strings.
	 */
	protected texts = {
		placeholder: "",
		openMenuAria: "",
		closeMenuAria: "",
		clearSelectionAria: ""
	};
	protected content = new TemplateContent();
	protected _placeholder = this.i18n.getOverridable("COMBOBOX.PLACEHOLDER");
	protected _openMenuAria = this.i18n.getOverridable("COMBOBOX.A11Y.OPEN_MENU");
	protected _closeMenuAria = this.i18n.getOverridable("COMBOBOX.A11Y.CLOSE_MENU");
	protected _clearSelectionAria = this.i18n.getOverridable("COMBOBOX.A11Y.CLEAR_SELECTED");
	private textSubscriptions: Record<string, Subscription> = {};
	private destroyRef = inject(DestroyRef);
	private element = inject(ElementRef).nativeElement;

	constructor() {
		super();
		this.override("placeholder", this._placeholder);
		this.override("openMenuAria", this._openMenuAria);
		this.override("closeMenuAria", this._closeMenuAria);
		this.override("clearSelectionAria", this._clearSelectionAria);
	}

	get multiple() {
		return false;
	}

	get selectedIndex() {
		const index = this._items.findIndex(item => item.selected);
		return index < 0 ? "" : String(index);
	}

	onSelected(event: Event) {
		const item = (event as CustomEvent<{ item: { value: string } | null }>).detail.item;
		if (item) {
			this.select([Number(item.value)]);
		} else {
			this.select([]);
			this.clear.emit(event);
		}
	}

	onToggled(event: Event) {
		if (!(event as CustomEvent<{ open: boolean }>).detail.open) {
			this.close.emit();
		}
	}

	onInput(event: Event) {
		this.search.emit((event.target as any).inputValue ?? (event.target as HTMLInputElement).value);
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}

	onEnter(event: Event) {
		const text: string = this.element.inputValue ?? "";
		if (text && !this._items.some(item => item.content === text)) {
			this.submit.emit({ items: this._items, index: -1, value: { content: text, selected: false } });
		}
	}

	/**
	 * v6 emitted the selected `ListItem` itself.
	 */
	protected emitSelected() {
		this.selected.emit(this.selectedItems[0]);
	}

	/**
	 * Applies an optional override and keeps `texts[key]` in sync with it (strings or observables).
	 */
	private override(key: keyof ComboBox["texts"], overridable: Overridable, value?: string | Observable<string>) {
		if (value !== undefined) {
			overridable.override(value);
		}
		this.textSubscriptions[key]?.unsubscribe();
		this.textSubscriptions[key] = overridable.subject
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(text => {
				this.texts[key] = text;
				this.changeDetectorRef.markForCheck();
			});
	}
}
