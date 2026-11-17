import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PopoverModule } from "carbon-components-angular/popover";
import { Tooltip } from "./tooltip.component";
import { TooltipDefinition } from "./definition-tooptip.component";
import { TooltipContent } from "./tooltip-content.component";

@NgModule({
	exports: [
		Tooltip,
		TooltipDefinition,
		TooltipContent
	],
	imports: [
		CommonModule,
		PopoverModule,
		Tooltip,
		TooltipDefinition,
		TooltipContent
	]
})
export class TooltipModule {}
