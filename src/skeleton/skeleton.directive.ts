/**
 * Copyright IBM Corp. 2024
 *
 * Directives for the skeleton web components.
 *
 * Replaces the old Angular SkeletonText / SkeletonPlaceholder / SkeletonIcon
 * components with thin directives on <cds-skeleton-text>,
 * <cds-skeleton-placeholder> and <cds-skeleton-icon>.
 */
import {
	Directive,
	ElementRef,
	Input,
	OnChanges
} from "@angular/core";

@Directive({
	selector: "cds-skeleton-text, [cdsSkeletonText], [ibmSkeletonText]",
	standalone: true
})
export class CdsSkeletonTextDirective implements OnChanges {
	/** Number of lines to render. */
	@Input() lines = 5;

	/** Render as a heading skeleton. */
	@Input() heading = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		el.setAttribute("lineCount", String(this.lines));
		if (this.lines > 1) {
			el.setAttribute("paragraph", "");
		} else {
			el.removeAttribute("paragraph");
		}
		if (this.heading) {
			el.setAttribute("type", "heading");
		} else {
			el.removeAttribute("type");
		}
	}
}

@Directive({
	selector: "cds-skeleton-placeholder, [cdsSkeletonPlaceholder], [ibmSkeletonPlaceholder]",
	standalone: true
})
export class CdsSkeletonPlaceholderDirective { }

@Directive({
	selector: "cds-skeleton-icon, [cdsSkeletonIcon], [ibmSkeletonIcon]",
	standalone: true
})
export class CdsSkeletonIconDirective { }
