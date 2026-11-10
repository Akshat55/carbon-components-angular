/**
 * Copyright IBM Corp. 2024
 *
 * AILabelModule
 *
 * Drop-in replacement for the old carbon-components-angular AILabelModule.
 * Registers the <cds-ai-label> web component and exports the thin Angular
 * directives that map the old API onto it.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSAILabel from "@carbon/web-components/es/components/ai-label/ai-label.js";

import {
	CdsAILabelDirective,
	CdsAILabelContentDirective,
	CdsAILabelActionsDirective
} from "./ai-label.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-ai-label", CDSAILabel);

@NgModule({
	imports: [
		CommonModule,
		CdsAILabelDirective,
		CdsAILabelContentDirective,
		CdsAILabelActionsDirective
	],
	exports: [
		CdsAILabelDirective,
		CdsAILabelContentDirective,
		CdsAILabelActionsDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AILabelModule { }
