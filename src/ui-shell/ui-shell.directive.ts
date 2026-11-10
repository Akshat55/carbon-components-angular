/**
 * Copyright IBM Corp. 2024
 *
 * Directives for the ui-shell web components.
 *
 * Replaces the old Angular ui-shell components (Header, HeaderItem,
 * HeaderMenu, Hamburger, SideNav, Panel, Switcher…) with thin directives on
 * the ui-shell web components. Old selectors are preserved where practical;
 * see MIGRATION.md for the element-name mapping.
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

/**
 * <cds-header> — the shell header bar.
 * `[brand]`/`[name]`/`[href]` generate a <cds-header-name> child, matching
 * the old Angular Header component API.
 */
@Directive({
	selector: "cds-header, [cdsHeader], [ibmHeader]",
	standalone: true
})
export class CdsHeaderDirective implements OnChanges {
	/** Brand text (rendered bold, e.g. "IBM"). */
	@Input() brand = "IBM";

	/** Product name next to the brand. */
	@Input() name: string;

	/** Link for the header name. */
	@Input() href = "#";

	private _nameEl: HTMLElement | null = null;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		if (this.name === undefined || this.name === null) {
			return;
		}
		if (!this._nameEl) {
			this._nameEl = document.createElement("cds-header-name");
			el.insertBefore(this._nameEl, el.firstChild);
		}
		this._nameEl.setAttribute("href", this.href);
		this._nameEl.setAttribute("prefix", this.brand);
		this._nameEl.textContent = this.name;
	}
}

/** <cds-header-menu-button> — the old Hamburger component. */
@Directive({
	selector: "cds-header-menu-button, cds-hamburger, [cdsHamburger], [ibmHamburger]",
	standalone: true
})
export class CdsHamburgerDirective implements OnChanges {
	/** Whether the menu button is in its active (open) state. */
	@Input() active = false;

	/** Emits when the button is clicked. */
	@Output() selected = new EventEmitter<Event>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		if (this.active) {
			this._el.nativeElement.setAttribute("active", "");
		} else {
			this._el.nativeElement.removeAttribute("active");
		}
	}

	@HostListener("click", ["$event"])
	onClick(event: Event): void {
		this.selected.emit(event);
	}
}

/** <cds-header-nav> — the old HeaderNavigation component. */
@Directive({
	selector: "cds-header-nav, cds-header-navigation, [cdsHeaderNav], [ibmHeaderNav]",
	standalone: true
})
export class CdsHeaderNavDirective implements OnChanges {
	/** Accessible label for the nav. */
	@Input() ariaLabel: string;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		if (this.ariaLabel) {
			this._el.nativeElement.setAttribute("menu-bar-label", this.ariaLabel);
		}
	}
}

/** <cds-header-nav-item> — the old HeaderItem component. */
@Directive({
	selector: "cds-header-nav-item, cds-header-item, [cdsHeaderItem], [ibmHeaderItem]",
	standalone: true
})
export class CdsHeaderItemDirective implements OnChanges {
	/** Link destination. */
	@Input() href = "#";

	/** Marks this item as the current page. */
	@Input() isCurrentPage = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;
		el.setAttribute("href", this.href);
		if (this.isCurrentPage) {
			el.setAttribute("is-active", "");
		} else {
			el.removeAttribute("is-active");
		}
	}
}

/** <cds-header-menu> — the old HeaderMenu component. */
@Directive({
	selector: "cds-header-menu, [cdsHeaderMenu], [ibmHeaderMenu]",
	standalone: true
})
export class CdsHeaderMenuDirective implements OnChanges {
	/** Menu trigger label. */
	@Input() title: string;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;
		if (this.title) {
			el.setAttribute("trigger-content", this.title);
			el.setAttribute("menu-label", this.title);
		}
	}
}

/** <cds-header-global-action> — the old HeaderAction component. */
@Directive({
	selector: "cds-header-global-action, cds-header-action, [cdsHeaderAction], [ibmHeaderAction]",
	standalone: true
})
export class CdsHeaderGlobalActionDirective implements OnChanges {
	/** Tooltip / accessible label for the action. */
	@Input() title: string;

	/** Whether the action's panel is active. */
	@Input() active = false;

	/** Emits when the action is clicked. */
	@Output() selected = new EventEmitter<Event>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;
		if (this.title) {
			el.setAttribute("tooltip-text", this.title);
			el.setAttribute("button-label-active", this.title);
			el.setAttribute("button-label-inactive", this.title);
		}
		if (this.active) {
			el.setAttribute("active", "");
		} else {
			el.removeAttribute("active");
		}
	}

	@HostListener("click", ["$event"])
	onClick(event: Event): void {
		this.selected.emit(event);
	}
}

/** <cds-side-nav> — the old SideNav component. */
@Directive({
	selector: "cds-side-nav, cds-sidenav, [cdsSideNav], [ibmSideNav]",
	standalone: true
})
export class CdsSideNavDirective implements OnChanges {
	/** Whether the side nav is expanded. */
	@Input() expanded = true;

	/** Rail variant — collapses to a narrow rail. */
	@Input() rail = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		if (this.expanded) {
			el.setAttribute("expanded", "");
		} else {
			el.removeAttribute("expanded");
		}
		if (this.rail) {
			el.setAttribute("collapse-mode", "rail");
		}
	}
}

/** <cds-side-nav-link> — the old SideNavItem component. */
@Directive({
	selector: "cds-side-nav-link, cds-sidenav-item, [cdsSideNavItem], [ibmSideNavItem]",
	standalone: true
})
export class CdsSideNavItemDirective implements OnChanges {
	/** Link destination. */
	@Input() href = "#";

	/** Marks this item as the active page. */
	@Input() active = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;
		el.setAttribute("href", this.href);
		if (this.active) {
			el.setAttribute("active", "");
		} else {
			el.removeAttribute("active");
		}
	}
}

/** <cds-side-nav-menu> — the old SideNavMenu component. */
@Directive({
	selector: "cds-side-nav-menu, cds-sidenav-menu, [cdsSideNavMenu], [ibmSideNavMenu]",
	standalone: true
})
export class CdsSideNavMenuDirective implements OnChanges {
	/** Menu title. */
	@Input() title: string;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		if (this.title) {
			this._el.nativeElement.setAttribute("title", this.title);
		}
	}
}

/** <cds-header-panel> — the old Panel component. */
@Directive({
	selector: "cds-header-panel, cds-panel, [cdsPanel], [ibmPanel]",
	standalone: true
})
export class CdsHeaderPanelDirective implements OnChanges {
	/** Whether the panel is expanded. */
	@Input() expanded = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		if (this.expanded) {
			this._el.nativeElement.setAttribute("expanded", "");
		} else {
			this._el.nativeElement.removeAttribute("expanded");
		}
	}
}

/** <cds-switcher-item> — the old SwitcherListItem component. */
@Directive({
	selector: "cds-switcher-item, cds-switcher-list-item, [cdsSwitcherListItem], [ibmSwitcherListItem]",
	standalone: true
})
export class CdsSwitcherItemDirective implements OnChanges {
	/** Link destination. */
	@Input() href = "#";

	/** Marks this item as selected. */
	@Input() active = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;
		el.setAttribute("href", this.href);
		if (this.active) {
			el.setAttribute("selected", "");
		} else {
			el.removeAttribute("selected");
		}
	}
}
