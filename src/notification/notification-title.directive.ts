import { Directive, HostBinding } from "@angular/core";

@Directive({
	selector: "[cdsNotificationTitle], [ibmNotificationTitle]",
	standalone: true
})
export class NotificationTitle {
	@HostBinding("attr.slot") slot = "title";
}
