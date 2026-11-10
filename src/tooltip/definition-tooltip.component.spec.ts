import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Component, DebugElement, Input } from "@angular/core";
import { By } from "@angular/platform-browser";

import { settle, shadow } from "../test-helpers/web-components";
import { TooltipDefinition } from ".";

@Component({
	template: `
		<cds-definition-tooltip
			[(isOpen)]="isOpen"
			[description]="description"
			[autoAlign]="autoAlign">
			definition
		</cds-definition-tooltip>
		`,
	imports: [TooltipDefinition]
})
class TestTTDefinitionComponent {
	@Input() isOpen = false;
	@Input() description = "Some description";
	@Input() autoAlign = false;
}

describe("Definition tooltip", () => {
	let fixture: ComponentFixture<TestTTDefinitionComponent>;
	let component: TestTTDefinitionComponent;
	let tooltipEl: DebugElement;
	let element: any;
	const button = () => shadow<HTMLButtonElement>(element, "button");
	const popover = (): any => shadow(element, "cds-popover");

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [TestTTDefinitionComponent]
		});
		fixture = TestBed.createComponent(TestTTDefinitionComponent);
		component = fixture.componentInstance;
		await settle(fixture);
		tooltipEl = fixture.debugElement.query(By.css("cds-definition-tooltip"));
		element = fixture.nativeElement.querySelector("cds-definition-tooltip");
	});

	it("should create a tooltip definition component", () => {
		expect(tooltipEl.componentInstance instanceof TooltipDefinition).toBe(true);
		expect(element instanceof customElements.get("cds-definition-tooltip")).toBe(true);
		expect(button().classList).toContain("cds--definition-term");
		expect(element.querySelector("[slot=definition]").textContent.trim()).toBe("Some description");
	});

	it("should open/close tooltip definition popover on button mousedown", async () => {
		spyOn(tooltipEl.componentInstance.isOpenChange, "emit").and.callThrough();

		button().dispatchEvent(new MouseEvent("mousedown", { button: 0, bubbles: true, composed: true }));
		await settle(fixture);
		expect(tooltipEl.componentInstance.isOpenChange.emit).toHaveBeenCalledWith(true);
		expect(component.isOpen).toBe(true);
		expect(popover().open).toBe(true);

		button().dispatchEvent(new MouseEvent("mousedown", { button: 0, bubbles: true, composed: true }));
		await settle(fixture);
		expect(tooltipEl.componentInstance.isOpenChange.emit).toHaveBeenCalledWith(false);
		expect(component.isOpen).toBe(false);
		expect(popover().open).toBe(false);
	});

	it("should open when the host sets isOpen", async () => {
		component.isOpen = true;
		await settle(fixture);
		expect(element.open).toBe(true);
		expect(button().getAttribute("aria-expanded")).toBe("true");
	});

	it("should close on Escape", async () => {
		component.isOpen = true;
		await settle(fixture);

		button().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true }));
		await settle(fixture);

		expect(component.isOpen).toBe(false);
	});

	it("should pass auto alignment to the web component", async () => {
		component.autoAlign = true;
		await settle(fixture);
		expect(element.autoalign).toBe(true);
	});
});
