import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { settle, shadow } from "../test-helpers/web-components";
import { Notification, NotificationDisplayService } from "./index";
import { NotificationContent } from "./notification-content.interface";

@Component({
	template: `<cds-notification [notificationObj]="notificationObj" (close)="closed()" />`,
	imports: [Notification]
})
class NotificationTest {
	@ViewChild(Notification) notification: Notification;
	notificationObj: NotificationContent = {
		type: "info",
		title: "sample",
		message: "sample message"
	};
	closed = jasmine.createSpy("closed");
}

describe("Notification", () => {
	let fixture: ComponentFixture<NotificationTest>;
	let wrapper: NotificationTest;
	const element = (): any => fixture.nativeElement.querySelector("cds-inline-notification");

	const create = async (notificationObj?: NotificationContent) => {
		fixture = TestBed.createComponent(NotificationTest);
		wrapper = fixture.componentInstance;
		if (notificationObj) {
			wrapper.notificationObj = notificationObj;
		}
		await settle(fixture);
	};

	it("should work", async () => {
		await create();
		expect(wrapper.notification instanceof Notification).toBe(true);
		expect(element() instanceof customElements.get("cds-inline-notification")).toBe(true);
		expect(element().open).toBe(true);
	});

	for (const type of ["info", "error", "warning", "success"] as const) {
		it(`should render ${type} notification`, async () => {
			await create({ type, title: "sample", message: "sample message" });
			expect(element().kind).toBe(type);
			expect(element().getAttribute("kind")).toBe(type);
		});
	}

	it("should display the title and message", async () => {
		await create();
		expect(element().querySelector("[slot=title]").innerHTML.trim()).toEqual("sample");
		expect(element().querySelector("[slot=subtitle]").innerHTML.trim()).toEqual("sample message");
	});

	it("should emit close when close button is clicked, and leave removal to the app", async () => {
		await create();
		shadow<HTMLButtonElement>(element(), ".cds--inline-notification__close-button").click();
		await settle(fixture);

		expect(wrapper.closed).toHaveBeenCalled();
		expect(element().open).toBe(true);
	});

	it("should hide the close button when showClose is false", async () => {
		await create({ type: "info", title: "sample", message: "sample message", showClose: false });
		expect(element().hideCloseButton).toBe(true);
	});

	it("should close through the display service when destroyed programmatically", async () => {
		await create();
		// the notification provides its own display service, so take it from that injector
		const displayService = fixture.debugElement.query(By.directive(Notification)).injector.get(NotificationDisplayService);
		spyOn(displayService, "close");

		wrapper.notification.destroy();

		expect(displayService.close).toHaveBeenCalled();
	});

	it("should update the message when the notification object changes", async () => {
		await create({ type: "info", title: "Uploading", message: "0% complete" });

		wrapper.notification.notificationObj.message = "100% complete";
		await settle(fixture);

		expect(element().querySelector("[slot=subtitle]").innerHTML.trim()).toBe("100% complete");
	});

	it("should restyle the notification when the type changes", async () => {
		await create();
		expect(element().kind).toBe("info");

		wrapper.notification.notificationObj.type = "error";
		await settle(fixture);

		expect(element().kind).toBe("error");
	});
});
