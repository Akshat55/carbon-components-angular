/**
 * Storybook stories for the Angular file-uploader directive layer.
 * The directives map the old API onto the file-uploader web components.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { FileUploaderModule } from "./index";

export default {
	title: "Components/File Uploader",
	decorators: [
		moduleMetadata({
			imports: [FileUploaderModule]
		})
	],
	argTypes: {
		title: { control: "text" },
		description: { control: "text" },
		disabled: { control: "boolean" },
		multiple: { control: "boolean" },
		filesChange: { action: "filesChange" }
	},
	args: {
		title: "Account photo",
		description: "Only .jpg and .png files. 500kb max file size.",
		disabled: false,
		multiple: true
	}
} as Meta;

export const Basic = (args) => ({
	props: { ...args, accept: [".jpg", ".png"] },
	template: `
		<cds-file-uploader
			[title]="title"
			[description]="description"
			[disabled]="disabled"
			(filesChange)="filesChange($event)">
			<cds-file-uploader-drop-container [accept]="accept" [multiple]="multiple">
				Drag and drop files here or click to upload
			</cds-file-uploader-drop-container>
		</cds-file-uploader>
	`
});
