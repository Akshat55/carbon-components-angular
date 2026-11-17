import { Directive, HostBinding } from "@angular/core";

@Directive({
	selector: "[cdsToastTitle], [ibmToastTitle]",
	standalone: true
})
export class ToastTitle {
	@HostBinding("attr.slot") slot = "title";
}
