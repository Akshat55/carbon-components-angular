import {
	AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/menu/index.js";
import { IconDirective } from "carbon-components-angular/icon";
import { observeChildren, registerWrapper, wrapperOf } from "carbon-components-angular/utils";
import { ContextMenuComponent } from "./context-menu.component";
import { ItemClickEvent } from "./context-menu.types";

/**
 * Adds Angular inputs and outputs to the `<cds-menu-item>` web component. A projected `cds-menu` becomes its submenu.
 * `type="checkbox"` / `"radio"` items show a checkmark when `checked`.
 */
@Component({
	selector: "cds-menu-item",
	template: `
		@if (type && checked) {
			<svg cdsIcon="checkmark" size="16" slot="render-icon"></svg>
		} @else if (icon) {
			<svg [cdsIcon]="icon" size="16" slot="render-icon"></svg>
		}
		<ng-content />
	`,
	host: {
		"[label]": "label",
		"[shortcut]": "info",
		"[disabled]": "disabled",
		"[kind]": "kind",
		"[dangerDescription]": "dangerDescription",
		"[attr.role]": "type === 'checkbox' ? 'menuitemcheckbox' : type === 'radio' ? 'menuitemradio' : 'menuitem'",
		"[attr.aria-checked]": "type ? checked : null",
		"(click)": "handleClick($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IconDirective],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContextMenuItemComponent implements AfterContentInit {
	@Input() label = "";
	/**
	 * Secondary text, e.g. a keyboard shortcut.
	 */
	@Input() info = "";
	@Input() type: null | "checkbox" | "radio" = null;
	@Input() checked = false;
	/**
	 * Icon name for `cdsIcon`.
	 */
	@Input() icon = "";
	@Input() value = "";
	@Input() disabled = false;
	@Input() kind: "default" | "danger" = "default";
	@Input() dangerDescription = "";

	@Output() checkedChange = new EventEmitter<boolean>();
	@Output() itemClick = new EventEmitter<ItemClickEvent>();

	readonly changeDetectorRef = inject(ChangeDetectorRef);
	protected element: HTMLElement = inject(ElementRef).nativeElement;

	constructor() {
		registerWrapper(this.element, this);
		// A child `cds-menu` (however it was created) is this item's submenu.
		observeChildren(this.element, inject(DestroyRef), () => this.slotSubmenu());
	}

	ngAfterContentInit() {
		this.slotSubmenu();
	}

	/**
	 * The submenu (a child `cds-menu`), if any.
	 */
	get childContextMenu(): ContextMenuComponent | null {
		const menu = this.element.querySelector(":scope > cds-menu");
		return menu ? wrapperOf(menu, ContextMenuComponent) : null;
	}

	/**
	 * The web component turns Enter / Space into a click.
	 */
	handleClick(event: MouseEvent & KeyboardEvent) {
		if (this.disabled || this.element.querySelector(":scope > cds-menu") || event.target !== event.currentTarget) {
			return;
		}
		if (this.type) {
			// A radio can't be unchecked by clicking it; a `cds-menu-item-group` unchecks the others.
			this.handleSelection(this.type === "radio" ? true : !this.checked);
		}
		this.itemClick.emit({ event, label: this.label, info: this.info, value: this.value, type: this.type });
	}

	handleSelection(selected: boolean) {
		this.checked = selected;
		this.checkedChange.emit(this.checked);
		this.changeDetectorRef.markForCheck();
	}

	protected slotSubmenu() {
		this.element.querySelector(":scope > cds-menu:not([slot])")?.setAttribute("slot", "submenu");
	}
}
