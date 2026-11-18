import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CdsButton } from "./button.component";
import { ButtonSet } from "./button-set.component";
import { BaseIconButton } from "./base-icon-button.component";
import { IconButton } from "./icon-button.component";

import { TooltipModule } from "carbon-components-angular/tooltip";
import { ButtonSkeleton } from "./button-skeleton.component";

@NgModule({
	exports: [
		CdsButton,
		ButtonSet,
		IconButton,
		ButtonSkeleton
	],
	imports: [
		CommonModule,
		TooltipModule,
		CdsButton,
		ButtonSet,
		BaseIconButton,
		IconButton,
		ButtonSkeleton
	]
})
export class ButtonModule {}
