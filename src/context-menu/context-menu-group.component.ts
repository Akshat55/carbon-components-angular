import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DestroyRef,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	inject
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import "@carbon/web-components/es/components/menu/index.js";
import { observeChildren, wrapperOf } from "carbon-components-angular/utils";
import { ContextMenuItemComponent } from "./context-menu-item.component";
import { ContextMenuSelectionService } from "./context-menu-selection.service";

/**
 * Adds Angular selection handling to the `<cds-menu-item-group>` web component. With `type`,
 * its `checkbox` / `radio` items share one selection (`value` / `valueChange`).
 */
@Component({
	selector: "cds-menu-item-group",
	template: "<ng-content />",
	host: {
		"[label]": "label",
		"(click)": "onItemClick($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContextMenuGroupComponent implements OnChanges {
	@Input() label = null;
	@Input() value: any[] = [];
	@Input() type: null | "radio" | "checkbox" = null;

	@Output() valueChange = new EventEmitter<any[]>();

	/**
	 * The group's selection. `selectRadio` / `selectCheckboxes` change it programmatically.
	 */
	readonly contextMenuSelectionService = new ContextMenuSelectionService();
	protected element: HTMLElement = inject(ElementRef).nativeElement;
	protected selection: any;

	constructor() {
		this.contextMenuSelectionService.selectionObservable.pipe(takeUntilDestroyed()).subscribe(value => {
			this.selection = value;
			this.sync();
			this.valueChange.emit(value);
		});
		// Items are read from the DOM, so items created any way (templates, `@for`, `createComponent`) count.
		observeChildren(this.element, inject(DestroyRef), () => this.sync());
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.value) {
			if (this.type === "radio") {
				this.contextMenuSelectionService.selectRadio(changes.value.currentValue);
			}
			if (this.type === "checkbox") {
				this.contextMenuSelectionService.selectCheckboxes(changes.value.currentValue);
			}
		}
	}

	onItemClick(event: Event) {
		const element = (event.target as Element).closest("cds-menu-item");
		const item = element && wrapperOf(element, ContextMenuItemComponent);
		if (!item || item.disabled || !item.type || !item.value) {
			return;
		}
		if (item.type === "radio") {
			this.contextMenuSelectionService.selectRadio(item.value);
		} else {
			this.contextMenuSelectionService.selectCheckbox(item.value);
		}
	}

	protected sync() {
		if (this.selection === undefined) {
			return;
		}
		this.element.querySelectorAll("cds-menu-item").forEach(element => {
			const item = wrapperOf(element, ContextMenuItemComponent);
			if (item?.type && item.value) {
				const checked = item.type === "radio" ? this.selection === item.value : this.selection.includes(item.value);
				if (checked !== item.checked) {
					item.checked = checked;
					item.changeDetectorRef.markForCheck();
				}
			}
		});
	}
}
