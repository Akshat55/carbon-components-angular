/**
 * Copyright IBM Corp. 2024
 *
 * InputModule
 *
 * Drop-in replacement for the old carbon-components-angular InputModule.
 * Registers the text-input / textarea / password-input web components and
 * exports the thin Angular directives that map the old API onto them.
 *
 * The old `cds-label` wrapper components are gone — the web components render
 * their own labels via the `label` attribute (see MIGRATION.md).
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import CDSTextInput from "@carbon/web-components/es/components/text-input/text-input.js";
import CDSTextarea from "@carbon/web-components/es/components/textarea/textarea.js";
import CDSPasswordInput from "@carbon/web-components/es/components/password-input/password-input.js";

import { CdsTextInputDirective } from "./input.directive";
import { CdsTextareaDirective } from "./text-area.directive";
import { CdsPasswordInputDirective } from "./password.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-text-input", CDSTextInput);
safeDefine("cds-textarea", CDSTextarea);
safeDefine("cds-password-input", CDSPasswordInput);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CdsTextInputDirective,
		CdsTextareaDirective,
		CdsPasswordInputDirective
	],
	exports: [
		CdsTextInputDirective,
		CdsTextareaDirective,
		CdsPasswordInputDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InputModule { }
