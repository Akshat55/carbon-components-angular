import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Button } from "./button.directive";
import { CdsButton } from "./button.component";
import { ButtonSet } from "./button-set.component";
import { BaseIconButton } from "./base-icon-button.component";
import { IconButton } from "./icon-button.component";

import { TooltipModule } from "carbon-components-angular/tooltip";

@NgModule({
	exports: [
		Button,
		CdsButton,
		ButtonSet,
		IconButton
	],
	imports: [
		CommonModule,
		TooltipModule,
		Button,
		CdsButton,
		ButtonSet,
		BaseIconButton,
		IconButton
	]
})
export class ButtonModule {}
