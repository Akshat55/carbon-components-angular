import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { CdsButton } from "carbon-components-angular/button";
import { InlineLoading, InlineLoadingState } from "../";

@Component({
	selector: "app-inline-loading",
	imports: [InlineLoading, CdsButton],
	template: `
		<cds-inline-loading
			[state]="state"
			[loadingText]="loadingText"
			[successText]="successText"
			[errorText]="errorText"
			[iconDescription]="iconDescription"
			(onSuccess)="onSuccess($event)">
		</cds-inline-loading>
		<cds-button (click)="toggleState()">Toggle state</cds-button>
		<p>State: {{ state }}</p>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineLoadingStory {
	@Input() loadingText = "";
	@Input() successText = "";
	@Input() errorText = "";
	@Input() iconDescription = "Loading status";

	state = InlineLoadingState.Active;

	toggleState() {
		switch (this.state) {
			case InlineLoadingState.Inactive: this.state = InlineLoadingState.Active; break;
			case InlineLoadingState.Active: this.state = InlineLoadingState.Finished; break;
			case InlineLoadingState.Finished: this.state = InlineLoadingState.Error; break;
			case InlineLoadingState.Error: this.state = InlineLoadingState.Inactive; break;
		}
	}
}
