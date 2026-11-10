/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsComboBoxDirective
 *
 * Sits directly on <cds-combo-box> — no wrapper element, no extra DOM node.
 * Translates the old carbon-components-angular `ComboBox` component
 * @Inputs/@Outputs to web component attributes/events, and implements
 * ControlValueAccessor so `[(ngModel)]` and reactive forms keep working
 * (values are the selected item's value string).
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [label]        → title-text attribute (string only)
 *   [helperText]   → helper-text attribute (string only)
 *   [placeholder]  → label attribute
 *   [size] [disabled] [readonly] [invalid] [invalidText] [warn] [warnText]
 *   [hideLabel] [value]
 *   [items]        → renders <cds-combo-box-item> children
 *   [itemValueKey] → property of an item object used as its value
 *   (selected)     ← bridged from the `cds-combo-box-selected` event
 *   (search)       ← emits the typed filter string on input
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	forwardRef,
	HostListener,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	TemplateRef
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ListItem } from "carbon-components-angular/dropdown";

@Directive({
	selector: "cds-combo-box, [cdsComboBox], [ibmComboBox]",
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CdsComboBoxDirective),
			multi: true
		}
	]
})
export class CdsComboBoxDirective implements OnChanges, ControlValueAccessor {
	/** Combo box title/label (string only). */
	@Input() label: string | TemplateRef<any>;

	/** Helper text (string only). */
	@Input() helperText: string | TemplateRef<any>;

	/** Input placeholder. */
	@Input() placeholder = "";

	/** Size of the combo box. */
	@Input() size: "sm" | "md" | "lg" = "md";

	@Input() disabled = false;
	@Input() readonly = false;
	@Input() invalid = false;
	@Input() invalidText: string | TemplateRef<any>;
	@Input() warn = false;
	@Input() warnText: string | TemplateRef<any>;
	@Input() hideLabel = false;

	/** Currently selected value. */
	@Input() value: any;

	/** Item list rendered as <cds-combo-box-item> children. */
	@Input() items: Array<ListItem | any> = [];

	/** Property of an item object used as its submitted value. */
	@Input() itemValueKey: string;

	/** Emits `{item, value}` when the selection changes. */
	@Output() selected = new EventEmitter<any>();

	/** Emits the typed filter string on every input. */
	@Output() search = new EventEmitter<string>();

	private _generated: HTMLElement[] = [];
	private _onChange: (value: any) => void = () => { };
	private _onTouched: () => void = () => { };

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(changes: SimpleChanges): void {
		const el = this._el.nativeElement;

		if (typeof this.label === "string") {
			el.setAttribute("title-text", this.label);
		}
		if (typeof this.helperText === "string") {
			el.setAttribute("helper-text", this.helperText);
		}
		if (typeof this.invalidText === "string") {
			el.setAttribute("invalid-text", this.invalidText);
		}
		if (typeof this.warnText === "string") {
			el.setAttribute("warn-text", this.warnText);
		}
		el.setAttribute("label", this.placeholder ?? "");
		el.setAttribute("size", this.size);
		if (this.value !== undefined && this.value !== null) {
			(el as any).value = String(this.value);
		}

		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("read-only", this.readonly);
		this._setBoolAttr("invalid", this.invalid);
		this._setBoolAttr("warn", this.warn);
		this._setBoolAttr("hide-label", this.hideLabel);

		if (changes["items"]) {
			this._renderItems();
		}
	}

	/** Bridge the web component's select event → `(selected)` + CVA. */
	@HostListener("cds-combo-box-selected", ["$event"])
	onSelected(event: CustomEvent): void {
		const item = event.detail?.item;
		const value = item?.value ?? (event.target as any)?.value;
		this.value = value;
		this.selected.emit({ item, value });
		this._onChange(value);
		this._onTouched();
	}

	/** Emit the typed filter string, matching the old `(search)` output. */
	@HostListener("input", ["$event"])
	onInput(event: Event): void {
		const target = event.target as HTMLInputElement | null;
		if (target && typeof target.value === "string") {
			this.search.emit(target.value);
		}
	}

	// ----------------------------------------------------- ControlValueAccessor
	writeValue(value: any): void {
		this.value = value;
		if (value !== undefined && value !== null) {
			(this._el.nativeElement as any).value = String(value);
		}
	}

	registerOnChange(fn: (value: any) => void): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this._onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
		this._setBoolAttr("disabled", isDisabled);
	}

	// ------------------------------------------------------- private helpers
	private _renderItems(): void {
		const el = this._el.nativeElement;

		this._generated.forEach((node) => node.remove());
		this._generated = [];

		if (!this.items) {
			return;
		}

		for (const item of this.items) {
			const itemEl = document.createElement("cds-combo-box-item");

			const content = typeof item === "string" ? item : item.content;
			const value = typeof item === "string"
				? item
				: (this.itemValueKey ? item[this.itemValueKey] : item.value ?? item.content);

			itemEl.setAttribute("value", String(value));
			itemEl.textContent = content ?? "";

			if (item.disabled) {
				itemEl.setAttribute("disabled", "");
			}
			if (item.selected) {
				(el as any).value = String(value);
			}

			el.appendChild(itemEl);
			this._generated.push(itemEl);
		}
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
