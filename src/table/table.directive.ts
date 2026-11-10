/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsTableDirective
 *
 * Sits directly on <cds-table> — the web component replacement for the old
 * Angular Table component.
 *
 * Two usage modes are supported:
 *
 * 1. Markup-driven (recommended) — author the table with the web component
 *    elements (<cds-table-head>, <cds-table-row>, <cds-table-cell>, …).
 *
 * 2. Model-driven (backwards compatible) — pass the same `TableModel` as
 *    before via `[model]` and the directive renders the head/body from it.
 *    String cell data is rendered as text; TemplateRef cells are not
 *    supported by the web component (see MIGRATION.md).
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [model] [size] [striped] [sortable] [showSelectionColumn]
 *   (sort)        ← emits the column index when a sortable header is clicked
 *   (rowClick)    ← emits the row index on click
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	Output,
	SimpleChanges
} from "@angular/core";
import { TableModel } from "./table-model.class";

@Directive({
	selector: "cds-table, [cdsTable], [ibmTable]",
	standalone: true
})
export class CdsTableDirective implements OnChanges {
	/** Table data model — same `TableModel` class as before. */
	@Input() model: TableModel;

	/** Table row size. */
	@Input() size: "xs" | "sm" | "md" | "lg" | "xl" = "md";

	/** Zebra striping. */
	@Input() striped = false;

	/** Enable sorting on all headers. */
	@Input() sortable = true;

	/** Render the selection (checkbox) column. */
	@Input() showSelectionColumn = false;

	/** Emits the column index when a sortable header is clicked. */
	@Output() sort = new EventEmitter<number>();

	/** Emits the row index when a row is clicked. */
	@Output() rowClick = new EventEmitter<number>();

	private _head: HTMLElement | null = null;
	private _body: HTMLElement | null = null;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(changes: SimpleChanges): void {
		const el = this._el.nativeElement;

		el.setAttribute("size", this.size);

		this._setBoolAttr("use-zebra-styles", this.striped);
		this._setBoolAttr("is-sortable", this.sortable);
		this._setBoolAttr("is-selectable", this.showSelectionColumn);

		if (changes["model"]) {
			this._renderModel();
		}
	}

	@HostListener("cds-table-header-cell-sort", ["$event"])
	onSort(event: CustomEvent): void {
		const cell = event.target as HTMLElement;
		const row = cell?.parentElement;
		if (row) {
			const index = Array.from(row.children).indexOf(cell);
			if (index >= 0) {
				this.sort.emit(index);
			}
		}
	}

	@HostListener("click", ["$event"])
	onClick(event: Event): void {
		const row = (event.target as HTMLElement)?.closest?.("cds-table-row");
		if (row && this._body?.contains(row)) {
			const index = Array.from(this._body.querySelectorAll("cds-table-row")).indexOf(row);
			if (index >= 0) {
				this.rowClick.emit(index);
			}
		}
	}

	/** Renders <cds-table-head>/<cds-table-body> from the TableModel. */
	private _renderModel(): void {
		const el = this._el.nativeElement;

		this._head?.remove();
		this._body?.remove();
		this._head = null;
		this._body = null;

		if (!this.model) {
			return;
		}

		// ------------------------------------------------------------- head
		const head = document.createElement("cds-table-head");
		const headerRow = document.createElement("cds-table-header-row");
		// The model stores headers as row-major TableHeaderItem[][]; the web
		// component supports a single header row.
		const headers = (Array.isArray(this.model.header?.[0])
			? this.model.header[0]
			: this.model.header) ?? [];
		for (const headerItem of headers as any[]) {
			const cell = document.createElement("cds-table-header-cell");
			const data = headerItem?.data;
			cell.textContent = typeof data === "string" ? data : String(data ?? "");
			headerRow.appendChild(cell);
		}
		head.appendChild(headerRow);
		el.appendChild(head);
		this._head = head;

		// ------------------------------------------------------------- body
		const body = document.createElement("cds-table-body");
		const rowCount = this.model.data?.length ?? 0;
		for (let i = 0; i < rowCount; i++) {
			const rowData = this.model.data[i];
			const row = document.createElement("cds-table-row");
			for (const item of rowData as any[]) {
				const cell = document.createElement("cds-table-cell");
				const data = item?.data;
				cell.textContent = typeof data === "string" ? data : String(data ?? "");
				row.appendChild(cell);
			}
			body.appendChild(row);
		}
		el.appendChild(body);
		this._body = body;
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
