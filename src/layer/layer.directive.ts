/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsLayerDirective
 *
 * Sits directly on <cds-layer> — the web component replacement for the old
 * class-based `[cdsLayer]` directive. The web component auto-increments
 * nested layer levels itself; `[cdsLayer]` can still be used to override
 * the level explicitly.
 *
 * Backwards-compatible API surface:
 *   [cdsLayer] → level attribute (0 | 1 | 2)
 *
 * `setLevel()` is used by the ThemeDirective to reset the layer level at a
 * theme boundary without stomping an explicit `[cdsLayer]` binding.
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges
} from "@angular/core";

@Directive({
	selector: "cds-layer, [cdsLayer], [ibmLayer]",
	exportAs: "layer",
	standalone: true
})
export class CdsLayerDirective implements OnChanges {
	/**
	 * @deprecated as of v5 - Use `cdsLayer` input property instead
	 */
	@Input() set ibmLayer(level: 0 | 1 | 2 | "") {
		this.cdsLayer = level;
	}

	/**
	 * Override layer level. When omitted the web component manages nesting
	 * (and a parent ThemeDirective may reset it to 1).
	 */
	@Input() cdsLayer: 0 | 1 | 2 | "" = "";

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		if (typeof this.cdsLayer === "number") {
			this.setLevel(this.cdsLayer);
		}
	}

	/**
	 * Writes the level onto the web component. Called by ThemeDirective when
	 * resetting layering at a theme boundary; the explicit `[cdsLayer]`
	 * binding always wins (ThemeDirective checks it before calling this).
	 */
	setLevel(level: number): void {
		this._el.nativeElement.setAttribute("level", String(level));
	}
}
