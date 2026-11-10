import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import { BehaviorSubject, isObservable, Observable, Subscription } from "rxjs";
import { I18n } from "carbon-components-angular/i18n";
import { ListItem } from "../list-item.interface";
import { ScrollCustomEvent } from "./scroll-custom-event.interface";

/**
 * Provides the items (and optional item template) to its parent `cds-dropdown`, `cds-multi-select`
 * or `cds-combo-box`. It renders nothing itself; the parent renders the web component items.
 *
 * ```html
 * <cds-dropdown [(ngModel)]="value">
 * 	<cds-dropdown-list [items]="items" [listTpl]="itemTemplate" />
 * </cds-dropdown>
 * ```
 */
@Component({
	selector: "cds-dropdown-list",
	template: "",
	styles: [":host { display: none; }"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownList implements OnDestroy {
	public i18n = inject(I18n);

	@Input() ariaLabel = this.i18n.get().DROPDOWN_LIST.LABEL;

	/**
	 * The items, or an `Observable` of them.
	 */
	@Input() set items(value: Array<ListItem> | Observable<Array<ListItem>>) {
		this._originalItems = value;
		this.subscription?.unsubscribe();
		if (isObservable(value)) {
			this.subscription = value.subscribe(items => this.items$.next(items ?? []));
		} else {
			this.items$.next(value ?? []);
		}
	}
	get items(): Array<ListItem> | Observable<Array<ListItem>> {
		return this._originalItems;
	}

	/**
	 * Template for each item's content, with the `ListItem` as `item` in its context.
	 */
	@Input() listTpl: string | TemplateRef<any> = null;
	/**
	 * @deprecated set by the parent.
	 */
	@Input() type: "single" | "multi" = "single";
	/**
	 * @deprecated
	 */
	@Input() showTitles = true;

	/**
	 * Emits the selection: `{ item, isUpdate }`, or the selected `ListItem[]` for multiple selection.
	 * The parent's `selected` output emits the same.
	 */
	@Output() select = new EventEmitter<{ item: ListItem, isUpdate?: boolean } | ListItem[]>();
	/**
	 * @deprecated the web component renders the list.
	 */
	@Output() scroll = new EventEmitter<ScrollCustomEvent>();
	/**
	 * @deprecated the web component renders the list.
	 */
	@Output() blurIntent = new EventEmitter<"top" | "bottom">();

	/**
	 * The current items, as a stream.
	 */
	readonly items$ = new BehaviorSubject<ListItem[]>([]);

	protected _originalItems: Array<ListItem> | Observable<Array<ListItem>>;
	private subscription: Subscription;

	getListItems() {
		return this.items$.value;
	}

	getSelected() {
		return this.items$.value.filter(item => item.selected);
	}

	ngOnDestroy() {
		this.subscription?.unsubscribe();
	}
}
