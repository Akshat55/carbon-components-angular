import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	DoCheck,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/progress-indicator/index.js";
import { I18n } from "carbon-components-angular/i18n";
import { Step } from "./progress-indicator-step.interface";
import { ProgressStep } from "./progress-step.component";

const noop = () => {};

/**
 * Adds Angular inputs and outputs to the `<cds-progress-indicator>` web component and renders a `cds-progress-step` per step.
 *
 * ```html
 * <cds-progress-indicator [steps]="steps" [current]="1" (stepSelected)="go($event.index)" />
 * ```
 *
 * [See demo](../../?path=/story/components-progress-indicator--basic)
 */
@Component({
	selector: "cds-progress-indicator",
	template: `
		<ng-content />
		@for (step of steps; track $index; let i = $index) {
			<cds-progress-step
				[attr.data-step-index]="i"
				[label]="step.label"
				[secondaryLabel]="step.secondaryLabel ?? ''"
				[description]="step.description ?? ''"
				[disabled]="!!step.disabled"
				[state]="state(step, i)"
				[invalid]="!!step.invalid"
				[clickable]="stepSelected.observed"
				[iconLabel]="translations?.[step.invalid ? 'INVALID' : state(step, i).toUpperCase()]"
				(click)="onClick(i)" />
		}
	`,
	host: {
		"[vertical]": "orientation === 'vertical'",
		"[spaceEqually]": "spacing === 'equal'",
		"[currentIndex]": "current",
		"(cds-progress-step-click)": "onChildClick($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ProgressStep],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProgressIndicator implements DoCheck {
	public i18n = inject(I18n);

	/**
	 * Index of the current step.
	 */
	@Input() current: number;
	@Input() steps: Array<Step>;
	@Input() orientation: "horizontal" | "vertical" = "horizontal";
	@Input() spacing: "default" | "equal" = "default";
	/**
	 * Labels for each step's status icon (`CURRENT`, `COMPLETE`, `INCOMPLETE`, `INVALID`).
	 */
	@Input() translations = this.i18n.get().PROGRESS_INDICATOR;

	@Output() stepSelected = new EventEmitter<{ step: Step, index: number }>();

	protected element: HTMLElement = inject(ElementRef).nativeElement;

	ngDoCheck() {
		// With an `onChange` the web component makes its `cds-progress-step` children
		// clickable. Angular doesn't allow binding `on*` properties, so set it here.
		const onChange = this.stepSelected.observed ? noop : undefined;
		if ((this.element as any).onChange !== onChange) {
			(this.element as any).onChange = onChange;
		}
	}

	state(step: Step, index: number) {
		if (index === this.current) {
			return "current";
		}
		return step.complete ? "complete" : "incomplete";
	}

	/**
	 * Emits `stepSelected` for clickable steps written as children (`cds-progress-step`).
	 */
	onChildClick(event: Event) {
		const element = event.target as HTMLElement & { label: string, secondaryLabel: string, description: string, invalid: boolean };
		if (element.hasAttribute("data-step-index")) {
			return;
		}
		const index = Array.from(this.element.querySelectorAll("cds-progress-step")).indexOf(element);
		this.stepSelected.emit({
			step: {
				label: element.label,
				secondaryLabel: element.secondaryLabel,
				description: element.description,
				invalid: element.invalid
			} as Step,
			index
		});
	}

	onClick(index: number) {
		const step = this.steps[index];
		if (index === this.current || step.disabled) {
			return;
		}
		if (typeof step.onClick === "function") {
			step.onClick();
		}
		this.stepSelected.emit({ step, index });
	}
}
