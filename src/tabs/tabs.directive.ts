/**
 * Copyright IBM Corp. 2024
 *
 * Directives: CdsTabsDirective / CdsTabDirective
 *
 * Sit directly on <cds-tabs> / <cds-tab> — the web component replacements
 * for the old Angular Tabs/Tab components.
 *
 * The web component separates tab headers from tab panels (see MIGRATION.md):
 *
 *   <cds-tabs value="one" (selected)="...">
 *     <cds-tab id="tab-one" value="one" target="panel-one">Tab one</cds-tab>
 *     <cds-tab id="tab-two" value="two" target="panel-two">Tab two</cds-tab>
 *   </cds-tabs>
 *   <div id="panel-one" role="tabpanel">Panel one content</div>
 *   <div id="panel-two" role="tabpanel" hidden>Panel two content</div>
 *
 * Backwards-compatible API surface:
 *   Tabs: [type]      → type attribute ('contained' for contained tabs)
 *         [value]     → currently selected tab value
 *         (selected)  ← bridged from the `cds-tabs-selected` event
 *   Tab:  [value] [disabled] [target]
 *         [heading]   → sets the tab's text content (string only)
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
	selector: "cds-tabs, [cdsTabs], [ibmTabs]",
	standalone: true
})
export class CdsTabsDirective implements OnChanges {
	/** Tabs variant. */
	@Input() type: "line" | "contained" = "line";

	/** Value of the currently selected tab. */
	@Input() value: string;

	/** Emits the newly selected tab's value. */
	@Output() selected = new EventEmitter<any>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;
		el.setAttribute("type", this.type);
		if (this.value !== undefined && this.value !== null) {
			el.setAttribute("value", this.value);
		}
	}

	/** Bridge the web component's select event → `(selected)` output. */
	@HostListener("cds-tabs-selected", ["$event"])
	onSelected(event: CustomEvent): void {
		const value = event.detail?.item?.value ?? (event.target as any)?.value;
		this.value = value;
		this.selected.emit({ value, item: event.detail?.item });
	}
}

@Directive({
	selector: "cds-tab, [cdsTab], [ibmTab]",
	standalone: true
})
export class CdsTabDirective implements OnChanges {
	/** Value identifying this tab. */
	@Input() value: string;

	/** Set to `true` to disable this tab. */
	@Input() disabled = false;

	/** Id of the tab panel this tab controls. */
	@Input() target: string;

	/** Tab label (string only) — kept from the old `[heading]` input. */
	@Input() heading: string;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		if (this.value !== undefined && this.value !== null) {
			el.setAttribute("value", this.value);
		}
		if (this.target) {
			el.setAttribute("target", this.target);
		}
		if (typeof this.heading === "string" && this.heading.length > 0) {
			el.textContent = this.heading;
		}

		if (this.disabled) {
			el.setAttribute("disabled", "");
		} else {
			el.removeAttribute("disabled");
		}
	}
}
