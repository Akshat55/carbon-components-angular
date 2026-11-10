/**
 * Copyright IBM Corp. 2024
 *
 * FileUploaderModule
 *
 * Drop-in replacement for the old carbon-components-angular FileUploaderModule.
 * Registers the file-uploader web components and exports the thin Angular
 * directives that map the old @Input/@Output API onto them.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import CDSFileUploader from "@carbon/web-components/es/components/file-uploader/file-uploader.js";
import CDSFileUploaderButton from "@carbon/web-components/es/components/file-uploader/file-uploader-button.js";
import CDSFileUploaderDropContainer from "@carbon/web-components/es/components/file-uploader/file-uploader-drop-container.js";
import CDSFileUploaderItem from "@carbon/web-components/es/components/file-uploader/file-uploader-item.js";

import { CdsFileUploaderDirective, CdsFileUploaderButtonDirective } from "./file-uploader.directive";

function safeDefine(tag: string, ctor: CustomElementConstructor): void {
	if (!customElements.get(tag)) {
		customElements.define(tag, ctor);
	}
}

safeDefine("cds-file-uploader", CDSFileUploader);
safeDefine("cds-file-uploader-button", CDSFileUploaderButton);
safeDefine("cds-file-uploader-drop-container", CDSFileUploaderDropContainer);
safeDefine("cds-file-uploader-item", CDSFileUploaderItem);

@NgModule({
	imports: [
		CommonModule,
		CdsFileUploaderDirective,
		CdsFileUploaderButtonDirective
	],
	exports: [
		CdsFileUploaderDirective,
		CdsFileUploaderButtonDirective
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FileUploaderModule { }
