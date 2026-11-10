import { Component, Input } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AILabelComponent } from "./ai-label.component";
import { AILabelActions } from "./ai-label-actions.directive";
import { AILabelModule } from "./ai-label.module";
import { settle, shadow } from "../test-helpers/web-components";

@Component({
	template: `
		<cds-ai-label [(isOpen)]="open" [autoAlign]="false" align="bottom"
			(onOpen)="opened()" (onClose)="closed()">
			<div>AI Explained <strong>{{ score }}%</strong></div>
			<div cdsAILabelActions><button (click)="action()">View details</button></div>
		</cds-ai-label>`,
	imports: [AILabelComponent, AILabelActions]
})
class Host {
	open = false;
	score = 84;
	opened = jasmine.createSpy("opened");
	closed = jasmine.createSpy("closed");
	action = jasmine.createSpy("action");
}

describe("AILabel legacy projected content", () => {
	it("should keep plain content in the popover and actions in their own slot", async () => {
		const fixture = TestBed.createComponent(Host);
		await settle(fixture);
		const element = fixture.nativeElement.querySelector("cds-ai-label");
		expect(element instanceof customElements.get("cds-ai-label")).toBe(true);
		const body = shadow<HTMLSlotElement>(element, 'slot[name="body-text"]');
		const actions = shadow<HTMLSlotElement>(element, 'slot[name="actions"]');
		expect(body.assignedElements()[0].textContent).toContain("AI Explained");
		expect(body.assignedElements()[0].textContent).not.toContain("View details");
		expect(actions.assignedElements()[0].textContent).toContain("View details");
		const content = shadow<HTMLElement>(element, ".cds--popover-content");
		expect(content.checkVisibility()).toBe(false);
		shadow<HTMLButtonElement>(element, "button").click();
		await settle(fixture);
		expect(fixture.componentInstance.open).toBe(true);
		expect(fixture.componentInstance.opened).toHaveBeenCalledTimes(1);
		expect(content.checkVisibility()).toBe(true);
		fixture.componentInstance.score = 95;
		await settle(fixture);
		expect(body.assignedElements()[0].textContent).toContain("95%");
		element.querySelector("[cdsAILabelActions] button").click();
		expect(fixture.componentInstance.action).toHaveBeenCalledTimes(1);
		element.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
		await settle(fixture);
		expect(fixture.componentInstance.open).toBe(false);
		expect(fixture.componentInstance.closed).toHaveBeenCalledTimes(1);
	});

	it("should respond to programmatic open and close", async () => {
		const fixture = TestBed.createComponent(Host);
		fixture.componentInstance.open = true;
		await settle(fixture);
		const element = fixture.nativeElement.querySelector("cds-ai-label");
		expect(element.open).toBe(true);
		fixture.componentInstance.open = false;
		await settle(fixture);
		expect(element.open).toBe(false);
	});
});

@Component({
	template: `
		<cds-ai-label
			[id]="id"
			[aiText]="aiText"
			[textLabel]="textLabel"
			[kind]="kind"
			[size]="size"
			[revertActive]="revertActive"
			[revertLabel]="revertLabel"
			[ariaLabel]="ariaLabel"
			[autoAlign]="autoAlign"
			[align]="align"
			[(isOpen)]="isOpen"
			(revertClick)="onRevert($event)">
			<p class="ai-label-projection">Child content</p>
		</cds-ai-label>
	`,
	imports: [AILabelModule]
})
class TestAILabelHostComponent {
	@Input() id = "test-ai-label-id";
	@Input() aiText = "AI";
	@Input() textLabel: string;
	@Input() kind: "default" | "inline" = "default";
	@Input() size: any = "md";
	@Input() revertActive = false;
	@Input() revertLabel = "Revert to AI input";
	@Input() ariaLabel = "Show information";
	@Input() autoAlign = false;
	@Input() align: "bottom" | "bottom-start" = "bottom";
	@Input() isOpen = false;

	onRevert = jasmine.createSpy("onRevert");
}

@Component({
	template: `<div cdsAILabelActions class="actions-host"></div>`,
	imports: [AILabelModule]
})
class TestAILabelActionsComponent {}

describe("AILabel", () => {
	let fixture: ComponentFixture<TestAILabelHostComponent>;
	let component: TestAILabelHostComponent;
	let label: AILabelComponent;
	let element: any;
	const trigger = () => shadow<HTMLButtonElement>(element, "button.cds--toggletip-button");
	const container = () => shadow(element, ".cds--popover-container");

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [TestAILabelHostComponent]
		});
		fixture = TestBed.createComponent(TestAILabelHostComponent);
		component = fixture.componentInstance;
		await settle(fixture);
		label = fixture.debugElement.query(By.directive(AILabelComponent)).componentInstance;
		element = fixture.nativeElement.querySelector("cds-ai-label");
	});

	it("should create", () => {
		expect(label instanceof AILabelComponent).toBe(true);
		expect(element instanceof customElements.get("cds-ai-label")).toBe(true);
	});

	it("should render projected content in the popover body", () => {
		const body = shadow<HTMLSlotElement>(element, 'slot[name="body-text"]');
		expect(body.assignedElements()[0].querySelector(".ai-label-projection").textContent).toContain("Child content");
	});

	it("should render inline", () => {
		expect(getComputedStyle(element).display).toBe("inline-flex");
	});

	it("should respect aiText on the trigger", async () => {
		component.aiText = "IA";
		await settle(fixture);
		expect(shadow(element, ".cds--slug__text").textContent.trim()).toBe("IA");
	});

	it("should respect size on the trigger", async () => {
		component.size = "xl";
		await settle(fixture);
		expect(trigger().classList).toContain("cds--slug__button--xl");
	});

	it("should respect kind inline on the trigger", async () => {
		component.kind = "inline";
		await settle(fixture);
		expect(trigger().classList).toContain("cds--slug__button--inline");
	});

	it("should show textLabel when kind is inline", async () => {
		component.kind = "inline";
		component.textLabel = "Test text";
		await settle(fixture);
		expect(shadow(element, ".cds--slug__additional-text").textContent.trim()).toBe("Test text");
		expect(trigger().classList).toContain("cds--slug__button--inline-with-content");
	});

	it("should not render additional text when kind is not inline", async () => {
		component.kind = "default";
		component.textLabel = "Test text";
		await settle(fixture);
		expect(shadow(element, ".cds--slug__additional-text")).toBeNull();
	});

	it("should render the toggletip popover container", () => {
		expect(container().classList).toContain("cds--toggletip");
	});

	it("should set aria-label on trigger from aiText and ariaLabel", async () => {
		component.aiText = "AI";
		component.ariaLabel = "Show more";
		await settle(fixture);
		expect(trigger().getAttribute("aria-label")).toBe("AI - Show more");
	});

	it("should associate trigger with the label id", () => {
		expect(element.id).toBe("test-ai-label-id");
		expect(trigger().getAttribute("aria-controls")).toBe("test-ai-label-id");
	});

	it("should apply align classes", async () => {
		component.align = "bottom-start";
		await settle(fixture);
		expect(container().classList).toContain("cds--popover--bottom-start");
	});

	it("should pass auto alignment to the web component", async () => {
		component.autoAlign = true;
		await settle(fixture);
		expect(element.autoalign).toBe(true);
	});

	it("should render the caret", () => {
		expect(shadow(element, ".cds--popover-caret")).toBeTruthy();
	});

	it("should open and close when the trigger is clicked", async () => {
		spyOn(label.isOpenChange, "emit").and.callThrough();
		trigger().click();
		await settle(fixture);
		expect(label.isOpen).toBe(true);
		expect(component.isOpen).toBe(true);
		expect(label.isOpenChange.emit).toHaveBeenCalledWith(true);
		expect(container().classList).toContain("cds--popover--open");

		trigger().click();
		await settle(fixture);
		expect(label.isOpen).toBe(false);
		expect(label.isOpenChange.emit).toHaveBeenCalledWith(false);
	});

	it("should show the revert icon button when revertActive", async () => {
		component.revertActive = true;
		await settle(fixture);
		expect(element.revertActive).toBe(true);
		expect(shadow(element, "cds-icon-button")).toBeTruthy();
		expect(trigger()).toBeNull();
	});

	it("should emit revertClick when the revert icon button is activated", async () => {
		component.revertActive = true;
		await settle(fixture);
		shadow<HTMLElement>(element, "cds-icon-button").click();
		await settle(fixture);
		expect(component.onRevert).toHaveBeenCalled();
		expect(label.revertActive).toBe(false);
		expect(trigger()).toBeTruthy();
	});

	it("should expose revertLabel on the icon button tooltip", async () => {
		component.revertActive = true;
		component.revertLabel = "Test revert label";
		await settle(fixture);
		expect(shadow(element, "cds-icon-button [slot=tooltip-content]").textContent.trim()).toBe("Test revert label");
	});
});

describe("AILabelActions", () => {
	it("should apply toggletip-actions and ai-label-actions classes", () => {
		const fixture = TestBed.createComponent(TestAILabelActionsComponent);
		fixture.detectChanges();
		const actions = fixture.debugElement.query(By.directive(AILabelActions)).nativeElement;
		expect(actions.classList).toContain("cds--toggletip-actions");
		expect(actions.classList).toContain("cds--ai-label-actions");
		expect(actions.getAttribute("slot")).toBe("actions");
	});
});
