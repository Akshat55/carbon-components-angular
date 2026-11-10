/**
 * Copyright IBM Corp. 2024
 *
 * TooltipModule
 *
 * Drop-in replacement for the old carbon-components-angular TooltipModule.
 * Registers the tooltip web components and exports the thin Angular
 * directives that map the old @Input API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSTooltip from "@carbon/web-components/es/components/tooltip/tooltip.js";
import CDSTooltipContent from "@carbon/web-components/es/components/tooltip/tooltip-content.js";
import CDSDefinitionTooltip from "@carbon/web-components/es/components/tooltip/definition-tooltip.js";

import { CdsTooltipDirective } from "./tooltip.directive";
import { CdsDefinitionTooltipDirective } from "./definition-tooltip.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-tooltip", CDSTooltip);
safeDefine("cds-tooltip-content", CDSTooltipContent);
safeDefine("cds-definition-tooltip", CDSDefinitionTooltip);

@NgModule({
	imports: [
		CommonModule,
		CdsTooltipDirective,
		CdsDefinitionTooltipDirective
	],
	exports: [
		CdsTooltipDirective,
		CdsDefinitionTooltipDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TooltipModule { }
