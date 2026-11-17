import { Component, Input } from "@angular/core";

import { IconButton } from "carbon-components-angular/button";
import { IconDirective } from "carbon-components-angular/icon";
import { CdsLink } from "carbon-components-angular/link";
import { FileComponent } from "../file.component";

@Component({
	selector: "app-custom-file",
	imports: [CdsLink, IconButton, FileComponent, IconDirective],
	template: `
		<cds-file-uploader-item
			[size]="size"
			[fileItem]="fileItem"
			[nameTpl]="nameTpl"
			[actionsTpl]="actionsTpl">
		</cds-file-uploader-item>

		<ng-template #nameTpl let-fileItem>
			<cds-link href="#">{{ fileItem.file.name }}</cds-link>
		</ng-template>

		<ng-template #actionsTpl>
			<cds-icon-button kind="ghost" description="View" [size]="size">
				<svg cdsIcon="view" size="16"></svg>
			</cds-icon-button>
			<cds-icon-button kind="ghost" description="Download" [size]="size">
				<svg cdsIcon="download" size="16"></svg>
			</cds-icon-button>
		</ng-template>
	`
})
export class CustomFileStory {
	@Input() size = "sm";

	fileItem = {
		file: new File(["foo"], "Lorem ipsum dolor sit amet.txt", {
			type: "text/plain"
		}),
		state: "edit"
	};
}
