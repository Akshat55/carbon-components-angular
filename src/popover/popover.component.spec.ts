import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Component, Input } from "@angular/core";
import { By } from "@angular/platform-browser";

import { settle, shadow } from "../test-helpers/web-components";
import { PopoverContainer, PopoverContent } from "./";

@Component({
	template: `
		<cds-popover
			[(isOpen)]="isOpen"
			[dropShadow]="dropShadow"
			[align]="align"
			[caret]="caret"
			[highContrast]="highContrast"
			[autoAlign]="autoAlign">
			<p>Popover trigger</p>
			<cds-popover-content>
				<div>
					<p>Popover content</p>
				</div>
			</cds-popover-content>
		</cds-popover>
		`,
	imports: [PopoverContent, PopoverContainer]
})
class TestPopoverComponent {
	@Input() isOpen = false;
	@Input() dropShadow = true;
	@Input() align = "bottom";
	@Input() caret = true;
	@Input() highContrast = false;
	@Input() autoAlign = false;
}

describe("Popover", () => {
	let fixture: ComponentFixture<TestPopoverComponent>;
	let component: TestPopoverComponent;
	let popover: PopoverContainer;
	let element: any;
	const container = () => shadow(element, ".cds--popover-container");

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [TestPopoverComponent]
		});
		fixture = TestBed.createComponent(TestPopoverComponent);
		component = fixture.componentInstance;
		await settle(fixture);
		popover = fixture.debugElement.query(By.directive(PopoverContainer)).componentInstance;
		element = fixture.nativeElement.querySelector("cds-popover");
	});

	it("should create a popover container & content", () => {
		expect(popover instanceof PopoverContainer).toBe(true);
		expect(element instanceof customElements.get("cds-popover")).toBe(true);
		expect(container()).toBeTruthy();
		expect(element.querySelector("cds-popover-content") instanceof customElements.get("cds-popover-content")).toBe(true);
	});

	it("should open popover", async () => {
		component.isOpen = true;
		component.caret = false;
		component.dropShadow = false;
		component.highContrast = true;
		await settle(fixture);

		expect(element.open).toBe(true);
		expect(container().classList).toContain("cds--popover--open");
		expect(container().classList).not.toContain("cds--popover--caret");
		expect(container().classList).not.toContain("cds--popover--drop-shadow");
		expect(container().classList).toContain("cds--popover--high-contrast");
	});

	it("should apply appropriate classes based on property binding", async () => {
		expect(container().classList).toContain("cds--popover--caret");
		expect(container().classList).toContain("cds--popover--drop-shadow");
		expect(container().classList).toContain("cds--popover--bottom");

		component.align = "top";
		await settle(fixture);

		expect(container().classList).toContain("cds--popover--top");
	});

	it("should pass auto alignment to the web component", async () => {
		component.autoAlign = true;
		await settle(fixture);
		expect(element.autoalign).toBe(true);
	});

	it("should report open state changes made by the web component", async () => {
		const onClose = jasmine.createSpy("onClose");
		popover.onClose.subscribe(onClose);
		component.isOpen = true;
		await settle(fixture);

		element.open = false;
		await settle(fixture);

		expect(component.isOpen).toBe(false);
		expect(popover.isOpen).toBe(false);
		expect(onClose).toHaveBeenCalled();
	});
});
