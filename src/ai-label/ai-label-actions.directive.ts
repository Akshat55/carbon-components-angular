import { Directive, HostBinding } from "@angular/core";

/**
 * The AI label actions; placed in the web component's `actions` slot.
 */
@Directive({
	selector: "[cdsAILabelActions], [ibmAILabelActions]",
	standalone: true
})
export class AILabelActions {
	@HostBinding("attr.slot") slot = "actions";
}
