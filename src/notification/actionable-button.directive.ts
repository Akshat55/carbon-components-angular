import { Directive, HostBinding } from "@angular/core";

@Directive({
	selector: "[cdsActionableButton], [ibmActionableButton]",
	standalone: true
})
export class ActionableButton {
	@HostBinding("attr.slot") slot = "action";
	@HostBinding("attr.type") type = "button";
}
