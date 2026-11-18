import { Component, Input } from "@angular/core";
import { JsonPipe } from "@angular/common";

import { CdsButton, IconButton } from "carbon-components-angular/button";
import { IconDirective } from "carbon-components-angular/icon";
import { CdsLink } from "carbon-components-angular/link";
import { FileItem } from "../";
import { FileUploader } from "../file-uploader.component";

@Component({
	selector: "app-file-uploader-with-custom-file",
	imports: [CdsLink, IconButton, CdsButton, FileUploader, IconDirective, JsonPipe],
	template: `
		@if (lastViewedFile) {
			<p>Last viewed file: {{ lastViewedFile | json }}</p>
		}
		@if (lastDownloadedFile) {
			<p>Last downloaded file: {{ lastDownloadedFile | json }}</p>
		}
		<cds-file-uploader
			[title]="title"
			[description]="description"
			[buttonText]="buttonText"
			[buttonType]="buttonType"
			[accept]="accept"
			[multiple]="multiple"
			[(files)]="files"
			[size]="size"
			[fileItemSize]="fileItemSize"
			[disabled]="disabled"
			[fileNameTpl]="nameTpl"
			[fileActionsTpl]="actionsTpl">
		</cds-file-uploader>
		@if (files && files.size > 0) {
			<cds-button
				(click)="onUpload()"
				style="margin-top:20px">
				Upload
			</cds-button>
		}

		<ng-template #nameTpl let-fileItem>
			<cds-link href="#">{{ fileItem.file.name }}</cds-link>
		</ng-template>

		<ng-template #actionsTpl let-fileItem>
			<cds-icon-button kind="ghost" description="View" [size]="fileItemSize" (click)="onViewClick(fileItem)">
				<svg cdsIcon="view" size="16"></svg>
			</cds-icon-button>
			<cds-icon-button kind="ghost" description="Download" [size]="fileItemSize" (click)="onDownloadClick(fileItem)">
				<svg cdsIcon="download" size="16"></svg>
			</cds-icon-button>
		</ng-template>
	`
})
export class FileUploaderWithCustomFileStory {
	lastViewedFile: FileItem | null = null;
	lastDownloadedFile: FileItem | null = null;

	@Input() files = new Set<FileItem>();
	@Input() title;
	@Input() description;
	@Input() buttonText;
	@Input() buttonType = "primary";
	@Input() accept = [".jpg", ".png"];
	@Input() multiple;
	@Input() size = "md";
	@Input() disabled = false;
	@Input() fileItemSize: "sm" | "md" | "lg" = "lg";

	protected maxSize = 500000;

	onViewClick(file: FileItem) {
		this.lastViewedFile = file;
	}

	onDownloadClick(file: FileItem) {
		this.lastDownloadedFile = file;
	}

	onUpload() {
		this.files.forEach((fileItem) => {
			if (!fileItem.uploaded) {
				if (fileItem.file.size < this.maxSize) {
					fileItem.state = "upload";
					setTimeout(() => {
						fileItem.state = "complete";
						fileItem.uploaded = true;
						console.log(fileItem);
					}, 1500);
				}

				if (fileItem.file.size > this.maxSize) {
					fileItem.state = "upload";
					setTimeout(() => {
						fileItem.state = "edit";
						fileItem.invalid = true;
						fileItem.invalidTitle = "File size exceeds limit";
						fileItem.invalidText =
							"500kb max file size. Select a new file and try again.";
					}, 1500);
				}
			}
		});
	}
}
