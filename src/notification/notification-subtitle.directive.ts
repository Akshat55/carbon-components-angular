import { Directive, HostBinding } from "@angular/core";

@Directive({
	selector: "[cdsNotificationSubtitle], [ibmNotificationSubtitle]",
	standalone: true
})
export class NotificationSubtitle {
	@HostBinding("attr.slot") slot = "subtitle";
}
