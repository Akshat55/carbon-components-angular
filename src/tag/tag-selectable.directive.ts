/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsSelectableTagDirective
 *
 * Sits directly on <cds-selectable-tag> — the web component replacement for
 * the old Angular `TagSelectableComponent` (<cds-tag-selectable>).
 *
 * Backwards-compatible API surface:
 *   [size]             → size attribute
 *   [disabled]         → disabled attribute
 *   [selected]         → selected attribute
 *   (selectedChange)   ← re-emitted from the `cds-selectable-tag-selected` event
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
	selector: "cds-selectable-tag, [cdsTagSelectable], [ibmTagSelectable]",
	standalone: true
})
export class CdsSelectableTagDirective implements OnChanges {
	/** Tag render size. */
	@Input() size: "sm" | "md" | "lg" = "md";

	/** Set to `true` to disable the tag. */
	@Input() disabled = false;

	/** Whether the tag is currently selected. */
	@Input() selected = false;

	/** Emits the new selected state whenever the user toggles the tag. */
	@Output() selectedChange = new EventEmitter<boolean>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;
		el.setAttribute("size", this.size);
		this._setBoolAttr("disabled", this.disabled);
		this._setBoolAttr("selected", this.selected);
	}

	@HostListener("cds-selectable-tag-selected", ["$event"])
	onSelected(event: CustomEvent): void {
		this.selected = event.detail?.selected ?? this._el.nativeElement.hasAttribute("selected");
		this.selectedChange.emit(this.selected);
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
