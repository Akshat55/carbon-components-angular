import { Directive, HostBinding } from "@angular/core";

@Directive({
	selector: "[cdsToggletipAction], [ibmToggletipAction]",
	standalone: true
})
export class ToggletipAction {
	@HostBinding("attr.slot") slot = "actions";
}
