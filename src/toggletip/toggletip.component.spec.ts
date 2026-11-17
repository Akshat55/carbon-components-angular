import { TestBed, ComponentFixture } from "@angular/core/testing";
import { Component, Input, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

import { settle, shadow } from "../test-helpers/web-components";
import {
	Toggletip,
	ToggletipAction,
	ToggletipButton,
	ToggletipContent,
	ToggletipLabel
} from "./";

@Component({
	template: `
		<span cdsToggletipLabel>Toggletip label</span>
		<cds-toggletip
			[(isOpen)]="isOpen"
			[autoAlign]="autoAlign">
			<button cdsToggletipButton>
				btn
			</button>
			<div cdsToggletipContent>Content</div>
			<div cdsToggletipAction>
				<button>action btn</button>
			</div>
		</cds-toggletip>
		<button id="outside">outside</button>
		`,
	imports: [
		Toggletip,
		ToggletipContent,
		ToggletipButton,
		ToggletipAction,
		ToggletipLabel
	]
})
class TestToggletipComponent {
	@Input() isOpen = false;
	@Input() autoAlign = false;
}

describe("Toggletip", () => {
	let fixture: ComponentFixture<TestToggletipComponent>;
	let component: TestToggletipComponent;
	let toggletipEl: DebugElement;
	let element: any;
	const toggleButton = () => shadow<HTMLButtonElement>(element, ".cds--toggletip-button");

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [TestToggletipComponent]
		});
		fixture = TestBed.createComponent(TestToggletipComponent);
		component = fixture.componentInstance;
		await settle(fixture);
		toggletipEl = fixture.debugElement.query(By.css("cds-toggletip"));
		element = toggletipEl.nativeElement;
	});

	it("should create a toggletip component using helper directives", () => {
		expect(toggletipEl.componentInstance instanceof Toggletip).toBe(true);
		expect(element instanceof customElements.get("cds-toggletip")).toBe(true);
		expect(fixture.debugElement.query(By.directive(ToggletipLabel))).toBeTruthy();
		expect(fixture.debugElement.query(By.directive(ToggletipButton)).nativeElement.getAttribute("slot")).toBe("trigger");
		const content = fixture.debugElement.query(By.directive(ToggletipContent)).nativeElement;
		const action = fixture.debugElement.query(By.directive(ToggletipAction)).nativeElement;
		expect(shadow<HTMLSlotElement>(element, 'slot[name="body-text"]').assignedElements()).toEqual([content]);
		expect(shadow<HTMLSlotElement>(element, 'slot[name="actions"]').assignedElements()).toEqual([action]);
	});

	it("should leave styling to the web component", () => {
		const helpers = [ToggletipLabel, ToggletipContent, ToggletipAction]
			.map(type => fixture.debugElement.query(By.directive(type)).nativeElement);
		expect(helpers.every(helper => !helper.className.includes("cds--"))).toBe(true);
		expect(element.getAttribute("style")).toBeNull();
	});

	it("should open on button click and keep open after interacting with actions", async () => {
		spyOn(toggletipEl.componentInstance.isOpenChange, "emit").and.callThrough();
		toggleButton().click();
		await settle(fixture);
		expect(toggletipEl.componentInstance.isOpenChange.emit).toHaveBeenCalledWith(true);
		expect(component.isOpen).toBe(true);

		const action: HTMLButtonElement = element.querySelector("[cdsToggletipAction] button");
		action.focus();
		action.click();
		await settle(fixture);
		expect(toggletipEl.componentInstance.isOpen).toBe(true);
	});

	it("should close when the button is clicked again", async () => {
		toggleButton().click();
		await settle(fixture);
		toggleButton().click();
		await settle(fixture);
		expect(toggletipEl.componentInstance.isOpen).toBe(false);
		expect(component.isOpen).toBe(false);
	});

	it("should open when the host sets isOpen", async () => {
		component.isOpen = true;
		await settle(fixture);
		expect(element.open).toBe(true);
		expect(shadow(element, ".cds--toggletip--open")).toBeTruthy();
	});

	it("should pass auto alignment to the web component", async () => {
		component.autoAlign = true;
		await settle(fixture);
		expect(element.autoalign).toBe(true);
	});
});
