/**
 * Copyright IBM Corp. 2024
 *
 * Directives for the overflow-menu web components.
 *
 * Replaces the old Angular OverflowMenu (dialog-service based) with thin
 * directives on <cds-overflow-menu> / <cds-overflow-menu-body> /
 * <cds-overflow-menu-item>:
 *
 *   <cds-overflow-menu [description]="'Options'" (openChange)="...">
 *     <cds-overflow-menu-body [flip]="flipped">
 *       <cds-overflow-menu-item (selected)="...">Option 1</cds-overflow-menu-item>
 *       <cds-overflow-menu-item type="danger">Delete</cds-overflow-menu-item>
 *     </cds-overflow-menu-body>
 *   </cds-overflow-menu>
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	Output
} from "@angular/core";

@Directive({
	selector: "cds-overflow-menu, [cdsOverflowMenu], [ibmOverflowMenu]",
	standalone: true
})
export class CdsOverflowMenuDirective implements OnChanges {
	/** Whether the menu is open. */
	@Input() open = false;

	/** Direction the menu opens. */
	@Input() placement: "bottom" | "top" | "bottom,top" | "top,bottom" = "bottom";

	/** Emits the new open state whenever it changes. */
	@Output() openChange = new EventEmitter<boolean>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		if (this.open) {
			el.setAttribute("open", "");
		} else {
			el.removeAttribute("open");
		}
	}

	@HostListener("cds-overflow-menu-toggled", ["$event"])
	@HostListener("click")
	onToggled(): void {
		const open = this._el.nativeElement.hasAttribute("open");
		if (open !== this.open) {
			this.open = open;
			this.openChange.emit(open);
		}
	}
}

@Directive({
	selector: "cds-overflow-menu-item, cds-overflow-menu-option, [cdsOverflowMenuOption], [ibmOverflowMenuOption]",
	standalone: true
})
export class CdsOverflowMenuItemDirective implements OnChanges {
	/** 'danger' renders the destructive variant. */
	@Input() type: "normal" | "danger" = "normal";

	/** Set to `true` to disable the item. */
	@Input() disabled = false;

	/** Render as a link. */
	@Input() href: string;

	/** Render a divider above this item. */
	@Input() divider = false;

	/** Emits when the item is clicked. */
	@Output() selected: EventEmitter<any> = new EventEmitter();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		this._setBoolAttr("danger", this.type === "danger");
		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("divider", this.divider);
		if (this.href) {
			el.setAttribute("href", this.href);
		}
	}

	@HostListener("click")
	onClick(): void {
		if (!this.disabled) {
			this.selected.emit();
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
