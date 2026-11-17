import { Directive } from "@angular/core";

/**
 * @deprecated The `cds-toggletip` web component renders the text in its default slot as the
 * label: write the label inside `<cds-toggletip>`. This directive no longer does anything.
 */
@Directive({
	selector: "[cdsToggletipLabel], [ibmToggletipLabel]",
	standalone: true
})
export class ToggletipLabel {}
