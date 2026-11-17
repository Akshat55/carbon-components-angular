import { Directive, HostBinding } from "@angular/core";

@Directive({
	selector: "[cdsToastSubtitle], [ibmToastSubtitle]",
	standalone: true
})
export class ToastSubtitle {
	@HostBinding("attr.slot") slot = "subtitle";
}
