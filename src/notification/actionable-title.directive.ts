import { Directive, HostBinding } from "@angular/core";

@Directive({
	selector: "[cdsActionableTitle], [ibmActionableTitle]",
	standalone: true
})
export class ActionableTitle {
	@HostBinding("attr.slot") slot = "title";
}
