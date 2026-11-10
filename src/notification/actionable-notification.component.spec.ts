import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { settle } from "../test-helpers/web-components";
import { ActionableNotification } from "./actionable-notification.component";

@Component({
	template: `<cds-actionable-notification [notificationObj]="notificationObj"></cds-actionable-notification>`,
	imports: [ActionableNotification]
})
class ActionableNotificationTest {
	@ViewChild(ActionableNotification) notification: ActionableNotification;
	undo = jasmine.createSpy("undo");
	notificationObj: any = {
		type: "info",
		title: "Heads up",
		message: "something happened",
		actions: [{ text: "Undo", click: this.undo }]
	};
}

describe("ActionableNotification", () => {
	let fixture: ComponentFixture<ActionableNotificationTest>;
	let wrapper: ActionableNotificationTest;
	let element: any;

	beforeEach(async () => {
		fixture = TestBed.createComponent(ActionableNotificationTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-actionable-notification");
	});

	it("should work", () => {
		expect(wrapper.notification instanceof ActionableNotification).toBe(true);
		expect(element instanceof customElements.get("cds-actionable-notification")).toBe(true);
		expect(element.open).toBe(true);
	});

	it("should render the message and the action button", () => {
		expect(element.querySelector("[slot=subtitle]").textContent).toContain("something happened");
		const action = element.querySelector("cds-actionable-notification-button[slot=action]");
		expect(action.textContent).toContain("Undo");
	});

	it("should call the action's click handler", async () => {
		element.querySelector("cds-actionable-notification-button").click();
		await settle(fixture);
		expect(wrapper.undo).toHaveBeenCalledWith(jasmine.objectContaining({ action: wrapper.notificationObj.actions[0] }));
	});

	it("should update the message when the notification object changes", async () => {
		wrapper.notification.notificationObj.message = "updated message";
		await settle(fixture);

		expect(element.textContent).toContain("updated message");
	});

	it("should render an action added to the existing notification", async () => {
		expect(element.textContent).not.toContain("Retry");

		wrapper.notification.notificationObj.actions.push({ text: "Retry", click: () => { } });
		await settle(fixture);

		expect(element.textContent).toContain("Retry");
	});

	it("should restyle the notification when the type changes", async () => {
		wrapper.notification.notificationObj.type = "error";
		await settle(fixture);

		expect(element.kind).toBe("error");
	});
});
