import { Component, EventEmitter } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { settle, shadow } from "../test-helpers/web-components";
import { ProgressIndicator } from "./progress-indicator.component";
import { Step } from "./progress-indicator-step.interface";
import { ProgressStep } from "./progress-step.component";

@Component({
	template: `
		<cds-progress-indicator
			[steps]="steps"
			[current]="current"
			(stepSelected)="stepSelected.emit($event)" />
	`,
	imports: [ProgressIndicator]
})
class ProgressIndicatorTest {
	steps: Step[] = [
		{
			label: "First step",
			complete: true,
			secondaryLabel: "optional"
		},
		{
			label: "Second step",
			complete: false
		},
		{
			label: "Third step",
			complete: false
		},
		{
			label: "Fourth step",
			complete: false,
			invalid: true
		},
		{
			label: "Fifth step",
			complete: false,
			disabled: true
		}
	];

	current = 2;

	stepSelected = new EventEmitter<{ step: Step, index: number }>();
}

describe("Progress Indicator", () => {
	let fixture, wrapper, element;
	const steps = (): any[] => Array.from(element.querySelectorAll("cds-progress-step"));
	const currentStep = () => steps().find(step => step.state === "current");

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ProgressIndicatorTest]
		});
	});

	const create = async (changes: Partial<ProgressIndicatorTest> = {}) => {
		fixture = TestBed.createComponent(ProgressIndicatorTest);
		wrapper = fixture.componentInstance;
		Object.assign(wrapper, changes);
		await settle(fixture);
		element = fixture.nativeElement.querySelector("cds-progress-indicator");
	};

	it("should work", async () => {
		await create();
		expect(fixture.debugElement.query(By.directive(ProgressIndicator)).componentInstance instanceof ProgressIndicator).toBe(true);
		expect(element instanceof customElements.get("cds-progress-indicator")).toBe(true);
		expect(steps().length).toBe(5);
	});

	it("should set current to 2 and set current step to Third step", async () => {
		await create();
		expect(currentStep().label).toBe("Third step");
		expect(shadow(currentStep(), ".cds--progress-label").textContent).toContain("Third step");
		expect(steps()[0].state).toBe("complete");
		expect(steps()[0].secondaryLabel).toBe("optional");
	});

	it("should set warning icon when step is in error state", async () => {
		await create();
		expect(steps()[3].invalid).toBe(true);
		expect(shadow(steps()[3], ".cds--progress__warning")).toBeTruthy();
	});

	it("should label the step icons with the translations", async () => {
		await create();
		expect(steps()[2].iconLabel).toBe("Current");
		expect(steps()[0].iconLabel).toBe("Complete");
		expect(steps()[3].iconLabel).toBe("Invalid");
	});

	it("should set current step to fourth step, keeping its error state", async () => {
		await create({ current: 3 });
		expect(currentStep().label).toBe("Fourth step");
		expect(currentStep().invalid).toBe(true);
		expect(shadow(currentStep(), ".cds--progress__warning")).toBeTruthy();
	});

	it("should emit the step and index when a step is clicked", async () => {
		await create();
		spyOn(wrapper.stepSelected, "emit");

		shadow<HTMLElement>(steps()[1], ".cds--progress-label").click();
		await settle(fixture);

		expect(wrapper.stepSelected.emit).toHaveBeenCalledWith({ step: wrapper.steps[1], index: 1 });
	});

	it("should not emit when the current or a disabled step is clicked", async () => {
		await create();
		spyOn(wrapper.stepSelected, "emit");

		steps()[2].click();
		steps()[4].click();
		await settle(fixture);

		expect(wrapper.stepSelected.emit).not.toHaveBeenCalled();
	});

	it("should handle current being set to 0 after the component is initialized", async () => {
		await create();
		wrapper.current = 0;
		await settle(fixture);
		expect(currentStep().label).toBe("First step");
	});

	it("should handle steps and current being updated individually after the component is initialized", async () => {
		await create();
		wrapper.steps = wrapper.steps.concat([{
			label: "Sixth step",
			complete: false
		}]);
		await settle(fixture);
		wrapper.current = 5;
		await settle(fixture);
		expect(steps().length).toBe(6);
		expect(currentStep().label).toBe("Sixth step");
	});
});

@Component({
	template: `
		<cds-progress-indicator [current]="current" (stepSelected)="selected = $event">
			<cds-progress-step label="First" />
			<cds-progress-step label="Second" secondaryLabel="optional" />
			<cds-progress-step label="Third" />
		</cds-progress-indicator>
	`,
	imports: [ProgressIndicator, ProgressStep]
})
class ChildStepsTest {
	current = 1;
	selected: { step: Step, index: number };
}

describe("Progress Indicator with child steps", () => {
	let fixture, steps: any[];

	beforeEach(async () => {
		TestBed.configureTestingModule({ imports: [ChildStepsTest] });
		fixture = TestBed.createComponent(ChildStepsTest);
		await settle(fixture);
		steps = Array.from(fixture.nativeElement.querySelectorAll("cds-progress-step"));
	});

	it("should register the step web component", () => {
		expect(steps[0] instanceof customElements.get("cds-progress-step")).toBe(true);
		expect(steps[1].secondaryLabel).toBe("optional");
	});

	it("should set the step states from `current`", async () => {
		expect(steps.map(step => [step.complete, step.current])).toEqual([[true, false], [false, true], [false, false]]);

		fixture.componentInstance.current = 2;
		await settle(fixture);
		expect(steps[2].current).toBe(true);
		expect(steps[1].complete).toBe(true);
	});

	it("should make the steps clickable when stepSelected is observed", () => {
		expect(steps.every(step => step.clickable)).toBe(true);
		expect(shadow(steps[0], "[role='button']").getAttribute("tabindex")).toBe("0");
		// the current step stays unclickable
		expect(shadow(steps[1], "[role='button']").getAttribute("tabindex")).toBe("-1");
	});

	it("should emit the step and index when a step is clicked", async () => {
		shadow<HTMLElement>(steps[2], ".cds--progress-label").click();
		await settle(fixture);
		expect(fixture.componentInstance.selected.index).toBe(2);
		expect(fixture.componentInstance.selected.step.label).toBe("Third");
	});
});
