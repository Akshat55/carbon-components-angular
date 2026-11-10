import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { settle, shadow } from "../test-helpers/web-components";
import { Toast } from "./toast.component";

@Component({
	template: `<cds-toast [notificationObj]="notificationObj" (close)="closed()"></cds-toast>`,
	imports: [Toast]
})
class ToastTest {
	@ViewChild(Toast) toast: Toast;
	notificationObj: any = {
		type: "info",
		title: "Uploading",
		subtitle: "in progress",
		caption: "just now"
	};
	closed = jasmine.createSpy("closed");
}

describe("Toast", () => {
	let fixture: ComponentFixture<ToastTest>;
	let wrapper: ToastTest;
	const element = (): any => fixture.nativeElement.querySelector("cds-toast-notification");

	beforeEach(async () => {
		fixture = TestBed.createComponent(ToastTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
	});

	it("should work", () => {
		expect(wrapper.toast instanceof Toast).toBe(true);
		expect(element() instanceof customElements.get("cds-toast-notification")).toBe(true);
	});

	it("should render the title, subtitle and caption", () => {
		expect(element().querySelector("[slot=title]").textContent).toContain("Uploading");
		expect(element().querySelector("[slot=subtitle]").textContent).toContain("in progress");
		expect(element().querySelector("[slot=caption]").textContent).toContain("just now");
	});

	it("should not render the subtitle and caption when they are not provided", async () => {
		wrapper.notificationObj = { type: "info", title: "Uploading" };
		await settle(fixture);

		expect(element().querySelector("[slot=subtitle]")).toBeNull();
		expect(element().querySelector("[slot=caption]")).toBeNull();
		expect(element().textContent).not.toContain("undefined");
	});

	it("should set the kind for the notification type", () => {
		expect(element().kind).toBe("info");
	});

	it("should emit close when the close button is clicked", async () => {
		shadow<HTMLButtonElement>(element(), ".cds--toast-notification__close-button").click();
		await settle(fixture);

		expect(wrapper.closed).toHaveBeenCalled();
	});

	it("should update the subtitle when the notification object changes", async () => {
		wrapper.toast.notificationObj.subtitle = "finished";
		await settle(fixture);

		expect(element().textContent).toContain("finished");
		expect(element().textContent).not.toContain("in progress");
	});

	it("should restyle the toast when the type changes", async () => {
		wrapper.toast.notificationObj.type = "error";
		await settle(fixture);

		expect(element().kind).toBe("error");
	});
});
