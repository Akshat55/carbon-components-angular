/**
 * Copyright IBM Corp. 2024
 *
 * Directives for the structured-list web components.
 *
 * Old Angular structure:
 *   <cds-structured-list [selection]>
 *     <cds-list-header><cds-list-column>...</cds-list-column></cds-list-header>
 *     <cds-list-row [value]><cds-list-column>...</cds-list-column></cds-list-row>
 *   </cds-structured-list>
 *
 * New web component structure (see MIGRATION.md):
 *   <cds-structured-list [selection] [name]>
 *     <cds-structured-list-head>
 *       <cds-structured-list-header-row>
 *         <cds-structured-list-header-cell>...</cds-structured-list-header-cell>
 *       </cds-structured-list-header-row>
 *     </cds-structured-list-head>
 *     <cds-structured-list-body>
 *       <cds-structured-list-row [value]>
 *         <cds-structured-list-cell>...</cds-structured-list-cell>
 *       </cds-structured-list-row>
 *     </cds-structured-list-body>
 *   </cds-structured-list>
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

let structuredListCounter = 0;

@Directive({
	selector: "cds-structured-list, [cdsStructuredList], [ibmStructuredList]",
	standalone: true
})
export class CdsStructuredListDirective implements OnChanges {
	/** Set to `true` to enable radio-style row selection. */
	@Input() selection = false;

	/** Set to `true` for the condensed variant. */
	@Input() condensed = false;

	/** Set to `true` for the flushed variant. */
	@Input() flushed = false;

	/** Selection group name (used as the web component's selection-name). */
	@Input() name = `structured-list-${structuredListCounter++}`;

	/**
	 * Emits `{value, selected, name}` whenever a row is selected —
	 * same shape as the old Angular component.
	 */
	@Output() selected: EventEmitter<{ value: string; selected: boolean; name: string }> = new EventEmitter();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		if (this.selection) {
			el.setAttribute("selection-name", this.name);
		} else {
			el.removeAttribute("selection-name");
		}

		this._setBoolAttr("condensed", this.condensed);
		this._setBoolAttr("flush", this.flushed);
	}

	/** Rows fire a native change when their hidden radio toggles. */
	@HostListener("change", ["$event"])
	onChange(event: Event): void {
		const row = (event.target as HTMLElement)?.closest?.("cds-structured-list-row");
		const value = row?.getAttribute("selection-value") ?? (event.target as any)?.value;
		this.selected.emit({ value, selected: true, name: this.name });
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}

@Directive({
	selector: "cds-structured-list-row, [cdsListRow], [ibmListRow]",
	standalone: true
})
export class CdsStructuredListRowDirective implements OnChanges {
	/** Value submitted when this row is selected. */
	@Input() value: string;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		if (this.value !== undefined && this.value !== null) {
			this._el.nativeElement.setAttribute("selection-value", this.value);
		}
	}
}
