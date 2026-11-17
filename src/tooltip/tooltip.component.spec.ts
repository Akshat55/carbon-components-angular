import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Component, Input, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

import { settle, shadow } from "../test-helpers/web-components";
import { Tooltip } from "./tooltip.component";
import { TooltipDefinition } from "./definition-tooptip.component";

@Component({
	template: `
		<cds-tooltip
			[(isOpen)]="isOpen"
			[enterDelayMs]="enterDelayMs"
			[leaveDelayMs]="leaveDelayMs"
			[description]="description"
			[autoAlign]="autoAlign">
			<button>A</button>
		</cds-tooltip>
	`,
	imports: [Tooltip]
})
class TestTooltipComponent {
	@Input() isOpen = false;
	@Input() description = "Some description";
	@Input() enterDelayMs = 0;
	@Input() leaveDelayMs = 0;
	@Input() autoAlign = false;
}

describe("Tooltip", () => {
	let fixture: ComponentFixture<TestTooltipComponent>;
	let component: TestTooltipComponent;
	let tooltipEl: DebugElement;
	let element: any;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [TestTooltipComponent]
		});
		fixture = TestBed.createComponent(TestTooltipComponent);
		component = fixture.componentInstance;
		await settle(fixture);
		tooltipEl = fixture.debugElement.query(By.css("cds-tooltip"));
		element = tooltipEl.nativeElement;
	});

	it("should create a tooltip component", () => {
		expect(tooltipEl.componentInstance instanceof Tooltip).toBe(true);
		expect(element instanceof customElements.get("cds-tooltip")).toBe(true);
		const content = element.querySelector("cds-tooltip-content");
		expect(content.textContent.trim()).toBe("Some description");
		expect(shadow(content, ".cds--tooltip-content")).toBeTruthy();
	});

	it("should open/close tooltip on trigger mouseover/mouseleave", async () => {
		spyOn(tooltipEl.componentInstance.isOpenChange, "emit").and.callThrough();
		// the web component listens on its trigger
		element.querySelector("button").dispatchEvent(new MouseEvent("mouseover"));
		await settle(fixture);
		expect(tooltipEl.componentInstance.isOpenChange.emit).toHaveBeenCalledWith(true);
		expect(tooltipEl.componentInstance.isOpen).toBe(true);
		expect(component.isOpen).toBe(true);

		element.querySelector("button").dispatchEvent(new MouseEvent("mouseleave"));
		await settle(fixture);
		expect(tooltipEl.componentInstance.isOpenChange.emit).toHaveBeenCalledWith(false);
		expect(tooltipEl.componentInstance.isOpen).toBe(false);
		expect(component.isOpen).toBe(false);
	});

	it("should open/close tooltip on focus/focusout", async () => {
		element.querySelector("button").dispatchEvent(new FocusEvent("focus"));
		await settle(fixture);
		expect(tooltipEl.componentInstance.isOpen).toBe(true);

		element.querySelector("button").dispatchEvent(new FocusEvent("focusout"));
		await settle(fixture);
		expect(tooltipEl.componentInstance.isOpen).toBe(false);
	});

	it("should open when the host sets isOpen", async () => {
		component.isOpen = true;
		await settle(fixture);
		expect(element.open).toBe(true);
		expect(element.querySelector("cds-tooltip-content").hasAttribute("open")).toBe(true);
	});

	it("should pass auto alignment to the web component", async () => {
		component.autoAlign = true;
		await settle(fixture);
		expect(element.autoalign).toBe(true);
	});
});

@Component({
	template: `
		<cds-tooltip description="Plain"><button>Trigger</button></cds-tooltip>
		<cds-definition-tooltip description="Definition">Term</cds-definition-tooltip>
	`,
	imports: [Tooltip, TooltipDefinition]
})
class TestTooltipDefaultsComponent {}

describe("Tooltip defaults", () => {
	it("should keep the web components' own defaults when inputs are unset", async () => {
		const fixture = TestBed.createComponent(TestTooltipDefaultsComponent);
		await settle(fixture);
		const tooltip = fixture.nativeElement.querySelector("cds-tooltip");
		const definition = fixture.nativeElement.querySelector("cds-definition-tooltip");
		expect(tooltip.align).toBe("top");
		expect(tooltip.enterDelayMs).toBe(100);
		expect(tooltip.leaveDelayMs).toBe(300);
		expect(tooltip.highContrast).toBe(true);
		expect(tooltip.open).toBe(false);
		expect(definition.align).toBe("bottom");
		expect(definition.openOnHover).toBe(false);
	});

	it("should not emit when the open state did not change", async () => {
		const fixture = TestBed.createComponent(TestTooltipDefaultsComponent);
		await settle(fixture);
		const definition = fixture.debugElement.children[1].componentInstance as TooltipDefinition;
		const emitted = jasmine.createSpy("isOpenChange");
		definition.isOpenChange.subscribe(emitted);
		await definition.syncOpen();
		expect(emitted).not.toHaveBeenCalled();
	});
});
