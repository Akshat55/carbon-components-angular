import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProgressIndicator } from "./progress-indicator.component";
import { ProgressStep } from "./progress-step.component";
import { IconDirective } from "carbon-components-angular/icon";
import { I18nModule } from "carbon-components-angular/i18n";
import { ProgressIndicatorSkeleton, ProgressStepSkeleton } from "./progress-indicator-skeleton.component";

@NgModule({
	exports: [
		ProgressIndicator,
		ProgressStep,
		ProgressIndicatorSkeleton,
		ProgressStepSkeleton
	],
	imports: [
		CommonModule,
		IconDirective,
		I18nModule,
		ProgressIndicator,
		ProgressStep,
		ProgressIndicatorSkeleton,
		ProgressStepSkeleton
	]
})
export class ProgressIndicatorModule {}
