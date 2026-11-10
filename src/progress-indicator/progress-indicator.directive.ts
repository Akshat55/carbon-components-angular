/**
 * Copyright IBM Corp. 2024
 *
 * Directive: CdsProgressIndicatorDirective
 *
 * Sits directly on <cds-progress-indicator> — no wrapper element.
 *
 * The web component uses <cds-progress-step> children. To preserve the old
 * carbon-components-angular API — where the whole indicator was driven by a
 * `[steps]` array and `[current]` index — this directive renders the step
 * children from the array.
 *
 * Backwards-compatible API surface (matches carbon-components-angular):
 *   [steps]        → renders <cds-progress-step> children from Step objects
 *   [current]      → marks steps complete/current/incomplete by index
 *   [orientation]  → vertical attribute ('vertical' sets it)
 *   [spacing]      → space-equally attribute ('equal' sets it)
 *   (stepSelected) ← bridged from the `cds-progress-step-clicked` event
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	Output
} from "@angular/core";
import { Step } from "./progress-indicator-step.interface";

@Directive({
	selector: "cds-progress-indicator, [cdsProgressIndicator], [ibmProgressIndicator]",
	standalone: true
})
export class CdsProgressIndicatorDirective implements OnChanges {
	/** Array of steps — same `Step` interface as before. */
	@Input() steps: Array<Step>;

	/** Index of the current step. */
	@Input() current = 0;

	/** Layout orientation. */
	@Input() orientation: "horizontal" | "vertical" = "horizontal";

	/** 'equal' distributes steps evenly. */
	@Input() spacing: "default" | "equal" = "default";

	/** Emits `{step, index}` when a step is clicked. */
	@Output() stepSelected = new EventEmitter<{ step: Step; index: number }>();

	private _generated: HTMLElement[] = [];

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		this._setBoolAttr("vertical", this.orientation === "vertical");
		this._setBoolAttr("space-equally", this.spacing === "equal");

		this._renderSteps();
	}

	/** Bridge step clicks → `(stepSelected)` with the old event shape. */
	@HostListener("cds-progress-step-clicked", ["$event"])
	onStepClicked(event: CustomEvent): void {
		const stepEl = event.target as HTMLElement;
		const index = this._generated.indexOf(stepEl);
		if (index >= 0 && this.steps?.[index] && !this.steps[index].disabled) {
			const step = this.steps[index];
			this.stepSelected.emit({ step, index });
			if (typeof step.onClick === "function") {
				step.onClick();
			}
		}
	}

	private _renderSteps(): void {
		const el = this._el.nativeElement;

		this._generated.forEach((node) => node.remove());
		this._generated = [];

		if (!this.steps) {
			return;
		}

		this.steps.forEach((step, index) => {
			const stepEl = document.createElement("cds-progress-step");

			stepEl.setAttribute("label", step.label ?? "");
			if (step.secondaryLabel) {
				stepEl.setAttribute("secondary-label-text", step.secondaryLabel);
			}
			if (step.description) {
				stepEl.setAttribute("description", step.description);
			}

			// State resolution mirrors the old component: everything before
			// `current` is complete, `current` is the active step.
			const state =
				step.invalid ? "invalid" :
				step.complete || index < this.current ? "complete" :
				index === this.current ? "current" :
				"incomplete";
			stepEl.setAttribute("state", state);

			if (step.disabled) {
				stepEl.setAttribute("disabled", "");
			}

			el.appendChild(stepEl);
			this._generated.push(stepEl);
		});
	}

	private _setBoolAttr(name: string, value: boolean): void {
		if (value) {
			this._el.nativeElement.setAttribute(name, "");
		} else {
			this._el.nativeElement.removeAttribute(name);
		}
	}
}
