import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Component, ViewChild } from "@angular/core";

import { settle, shadow } from "../test-helpers/web-components";
import { Modal } from "./modal.component";
import { BaseModalService } from "./base-modal.service";
import { ModalModule } from "./modal.module";
import { ModalHeader } from "./modal-header.component";
import { ModalFooter } from "./modal-footer.component";

@Component({
	template: `
		<cds-modal [open]="open" ariaLabel="test modal" (overlaySelected)="overlaySelected()" (close)="closed()">
			<cds-modal-body>
				<button modal-primary-focus>focus me</button>
			</cds-modal-body>
		</cds-modal>
	`,
	imports: [ModalModule]
})
class ModalOpenStateTest {
	@ViewChild(Modal) modal: Modal;
	open = true;
	overlaySelected = jasmine.createSpy("overlaySelected");
	closed = jasmine.createSpy("closed");
}

describe("Modal", () => {
	let fixture: ComponentFixture<ModalOpenStateTest>;
	let wrapper: ModalOpenStateTest;
	let element: any;
	const escape = () => element.querySelector("[modal-primary-focus]")
		.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [ModalOpenStateTest]
		});

		fixture = TestBed.createComponent(ModalOpenStateTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-modal");
	});

	it("should work", () => {
		expect(wrapper.modal instanceof Modal).toBe(true);
		expect(element instanceof customElements.get("cds-modal")).toBe(true);
		expect(element.open).toBe(true);
		expect(element.ariaLabel).toBe("test modal");
	});

	it("should emit overlaySelected when the overlay is clicked, and stay open", async () => {
		element.click();
		await settle(fixture);

		expect(wrapper.overlaySelected).toHaveBeenCalled();
		expect(element.open).toBe(true);
	});

	it("should close modal when escape is pressed", async () => {
		const modalService = fixture.debugElement.query(By.directive(Modal)).injector.get(BaseModalService);
		spyOn(modalService, "destroy");

		escape();
		await settle(fixture);

		expect(modalService.destroy).toHaveBeenCalled();
		expect(wrapper.closed).toHaveBeenCalled();
		expect(wrapper.modal.open).toBe(false);
		expect(element.open).toBe(false);
	});

	it("should focus the primary element once the modal is open", async () => {
		wrapper.open = false;
		await settle(fixture);

		wrapper.open = true;
		await settle(fixture);
		// the focus is scheduled 100ms out
		await new Promise(resolve => setTimeout(resolve, 150));

		expect(document.activeElement).toBe(element.querySelector("[modal-primary-focus]"));
	});

	it("should reopen the modal after escape has closed it", async () => {
		escape();
		await settle(fixture);
		expect(element.open).toBe(false);

		// the host still holds `true`, so it has to pass through `false` for the input to change
		wrapper.open = false;
		await settle(fixture);
		wrapper.open = true;
		await settle(fixture);

		expect(wrapper.modal.open).toBe(true);
		expect(element.open).toBe(true);
	});
});

@Component({
	template: `
		<cds-modal [open]="true">
			<cds-modal-header [showCloseButton]="showCloseButton" (closeSelect)="closed = true">
				<h3 cdsModalHeaderHeading>{{heading}}</h3>
			</cds-modal-header>
			<div cdsModalContent>body</div>
			<cds-modal-footer>
				<cds-button kind="primary">Save</cds-button>
			</cds-modal-footer>
		</cds-modal>
	`,
	imports: [ModalModule]
})
class ModalHeaderFooterTest {
	@ViewChild(ModalHeader) header: ModalHeader;
	@ViewChild(ModalFooter) footer: ModalFooter;
	heading = "Modal heading";
	showCloseButton = true;
	closed = false;
}

describe("ModalHeader and ModalFooter", () => {
	let fixture: ComponentFixture<ModalHeaderFooterTest>;
	let wrapper: ModalHeaderFooterTest;
	const closeButton = () => fixture.nativeElement.querySelector("cds-modal-close-button");

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [ModalHeaderFooterTest]
		});

		fixture = TestBed.createComponent(ModalHeaderFooterTest);
		wrapper = fixture.componentInstance;
		await settle(fixture);
	});

	it("should work", () => {
		expect(wrapper.header instanceof ModalHeader).toBe(true);
		expect(wrapper.footer instanceof ModalFooter).toBe(true);
		expect(fixture.nativeElement.querySelector("cds-modal-header") instanceof customElements.get("cds-modal-header")).toBe(true);
		expect(fixture.nativeElement.querySelector("cds-modal-footer") instanceof customElements.get("cds-modal-footer")).toBe(true);
	});

	it("should render the projected heading, content and footer", () => {
		expect(fixture.nativeElement.querySelector(".cds--modal-header__heading").textContent).toContain("Modal heading");
		expect(fixture.nativeElement.querySelector(".cds--modal-content").textContent).toContain("body");
		expect(fixture.nativeElement.querySelector("cds-modal-footer").textContent).toContain("Save");
	});

	it("should emit closeSelect when the close button is clicked", async () => {
		shadow<HTMLElement>(closeButton(), "cds-icon-button").click();
		await settle(fixture);

		expect(wrapper.closed).toBe(true);
	});

	it("should hide the close button when it is turned off", async () => {
		expect(closeButton()).toBeTruthy();

		wrapper.showCloseButton = false;
		await settle(fixture);

		expect(closeButton()).toBeFalsy();
	});

	it("should update the heading when it changes", async () => {
		wrapper.heading = "Updated heading";
		await settle(fixture);

		expect(fixture.nativeElement.textContent).toContain("Updated heading");
	});
});
