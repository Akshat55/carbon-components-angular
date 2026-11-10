import {
	AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ContentChild,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	inject
} from "@angular/core";
import { Subscription } from "rxjs";
import "@carbon/web-components/es/components/menu/index.js";
import { IconDirective } from "carbon-components-angular/icon";
import { ContextMenuSelectionService } from "./context-menu-selection.service";
import { ContextMenuComponent } from "./context-menu.component";
import { ItemClickEvent } from "./context-menu.types";

/**
 * Wraps the `<cds-menu-item>` web component. A projected `cds-menu` becomes its submenu.
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
export class ContextMenuItemComponent implements OnInit, AfterContentInit, OnDestroy {
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

	@ContentChild(ContextMenuComponent, { static: true }) childContextMenu: ContextMenuComponent;

	protected contextMenuSelectionService = inject(ContextMenuSelectionService, { optional: true });
	private changeDetectorRef = inject(ChangeDetectorRef);
	private subscriptions = new Subscription();

	ngOnInit() {
		if (this.type && this.contextMenuSelectionService && this.value) {
			this.subscriptions.add(this.contextMenuSelectionService.selectionObservable.subscribe(value => {
				this.checked = this.type === "radio" ? value === this.value : value.includes(this.value);
				this.changeDetectorRef.markForCheck();
			}));
		}
	}

	ngAfterContentInit() {
		// A projected `cds-menu` is this item's submenu.
		this.childContextMenu?.elementRef.nativeElement.setAttribute("slot", "submenu");
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	/**
	 * The web component turns Enter / Space into a click.
	 */
	handleClick(event: MouseEvent & KeyboardEvent) {
		if (this.disabled || this.childContextMenu || event.target !== event.currentTarget) {
			return;
		}
		if (this.type) {
			this.handleSelection(!this.checked);
		}
		if (this.type === "radio") {
			this.contextMenuSelectionService?.selectRadio(this.value);
		}
		if (this.type === "checkbox") {
			this.contextMenuSelectionService?.selectCheckbox(this.value);
		}
		this.itemClick.emit({ event, label: this.label, info: this.info, value: this.value, type: this.type });
	}

	handleSelection(selected: boolean) {
		this.checked = selected;
		this.checkedChange.emit(this.checked);
	}
}
