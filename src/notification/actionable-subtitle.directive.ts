import { Directive, HostBinding } from "@angular/core";

@Directive({
	selector: "[cdsActionableSubtitle], [ibmActionableSubtitle]",
	standalone: true
})
export class ActionableSubtitle {
	@HostBinding("attr.slot") slot = "subtitle";
}
