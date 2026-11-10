/**
 * Copyright IBM Corp. 2024
 *
 * CodeSnippetModule
 *
 * Drop-in replacement for the old carbon-components-angular CodeSnippetModule.
 * Registers the <cds-code-snippet> web component and exports the thin
 * Angular directive that maps the old @Input API onto it.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSCodeSnippet from "@carbon/web-components/es/components/code-snippet/code-snippet.js";

import { CdsCodeSnippetDirective } from "./code-snippet.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-code-snippet", CDSCodeSnippet);

@NgModule({
	imports: [
		CommonModule,
		CdsCodeSnippetDirective
	],
	exports: [
		CdsCodeSnippetDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CodeSnippetModule { }
