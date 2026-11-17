import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FileUploader } from "./file-uploader.component";
import { FileComponent } from "./file.component";

import { LoadingModule } from "carbon-components-angular/loading";
import { IconDirective } from "carbon-components-angular/icon";
import { FileUploaderSkeleton } from "./file-uploader-skeleton.component";
import { FileUploaderButton, FileUploaderDropContainer } from "./file-uploader-parts.component";

@NgModule({
	exports: [FileUploader, FileComponent, FileUploaderSkeleton, FileUploaderButton, FileUploaderDropContainer],
	imports: [
		CommonModule,
		LoadingModule,
		IconDirective,
		FileUploader,
		FileComponent,
		FileUploaderSkeleton,
		FileUploaderButton,
		FileUploaderDropContainer
	]
})
export class FileUploaderModule {}
