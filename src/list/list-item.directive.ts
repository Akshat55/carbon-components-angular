/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsListItemDirective
 *
 * Sits directly on <cds-list-item> — the web component replacement for the
 * old `[cdsListItem]` directive on native <li> elements. Kept as a directive
 * so the old attribute selector keeps compiling; the web component handles
 * all styling.
 */
import { Directive } from "@angular/core";

@Directive({
	selector: "cds-list-item, [cdsListItem], [ibmListItem]",
	standalone: true
})
export class CdsListItemDirective { }
