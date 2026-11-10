import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/progress-indicator/index.js";
import { I18n } from "carbon-components-angular/i18n";
import { Step } from "./progress-indicator-step.interface";

/**
 * Wraps the `<cds-progress-indicator>` web component and renders a `cds-progress-step` per step.
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
		@for (step of steps; track $index; let i = $index) {
			<cds-progress-step
				[label]="step.label"
				[secondaryLabel]="step.secondaryLabel ?? ''"
				[description]="step.description ?? ''"
				[disabled]="!!step.disabled"
				[state]="state(step, i)"
				[clickable]="i !== current && !step.disabled"
				(click)="onClick(i)" />
		}
	`,
	host: {
		"[vertical]": "orientation === 'vertical'",
		"[spaceEqually]": "spacing === 'equal'",
		"[currentIndex]": "current"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProgressIndicator {
	static skeletonSteps(stepCount: number) {
		return Array.from({ length: stepCount }, () => ({ complete: false }));
	}

	public i18n = inject(I18n);

	/**
	 * Index of the current step.
	 */
	@Input() current: number;
	@Input() steps: Array<Step>;
	@Input() orientation: "horizontal" | "vertical" = "horizontal";
	@Input() spacing: "default" | "equal" = "default";
	/**
	 * @deprecated the web component provides its own state labels.
	 */
	@Input() translations = this.i18n.get().PROGRESS_INDICATOR;
	/**
	 * @deprecated use `<cds-progress-indicator-skeleton>` instead.
	 */
	@Input() skeleton = false;

	@Output() stepSelected = new EventEmitter<{ step: Step, index: number }>();

	state(step: Step, index: number) {
		if (step.invalid) {
			return "invalid";
		}
		if (index === this.current) {
			return "current";
		}
		return step.complete ? "complete" : "incomplete";
	}

	onClick(index: number) {
		const step = this.steps[index];
		if (this.skeleton || index === this.current || step.disabled) {
			return;
		}
		if (typeof step.onClick === "function") {
			step.onClick();
		}
		this.stepSelected.emit({ step, index });
	}
}
