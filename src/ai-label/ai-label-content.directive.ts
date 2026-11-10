import { Directive, HostBinding } from "@angular/core";

/**
 * The AI label explanation; placed in the web component's `body-text` slot.
 */
@Directive({
	selector: "[cdsAILabelContent], [ibmAILabelContent]",
	standalone: true
})
export class AILabelContent {
	@HostBinding("attr.slot") slot = "body-text";
}
