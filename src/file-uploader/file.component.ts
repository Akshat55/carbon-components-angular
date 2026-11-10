import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/file-uploader/index.js";
import { I18n } from "carbon-components-angular/i18n";
import { FileItem } from "./file-item.interface";

/**
 * Adds `fileItem` and `(remove)` to the `<cds-file-uploader-item>` web component (a file row of `cds-file-uploader`).
 */
@Component({
	selector: "cds-file-uploader-item",
	template: `
		@if (fileItem) {
			@if (nameTpl) {
				<ng-template [ngTemplateOutlet]="nameTpl" [ngTemplateOutletContext]="{ $implicit: fileItem }" />
			} @else {
				{{ fileItem.file.name }}
			}
			@if (actionsTpl && fileItem.state === 'edit') {
				<ng-template [ngTemplateOutlet]="actionsTpl" [ngTemplateOutletContext]="{ $implicit: fileItem }" />
			}
		}
		<ng-content />
	`,
	host: {
		"[state]": "fileItem?.state === 'upload' ? 'uploading' : fileItem?.state",
		"[size]": "size",
		"[invalid]": "!!fileItem?.invalid",
		"[errorSubject]": "fileItem?.invalidTitle ?? ''",
		"[errorBody]": "fileItem?.invalidText ?? ''",
		"[iconDescription]": "translations.REMOVE_BUTTON",
		"[title]": "fileItem?.file.name ?? ''",
		"(cds-file-uploader-item-beingdeleted)": "onDelete($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FileComponent {
	public i18n = inject(I18n);

	@Input() translations = this.i18n.get().FILE_UPLOADER;
	@Input() fileItem: FileItem;
	@Input() size: "sm" | "md" | "lg" = "lg";
	@Input() nameTpl: TemplateRef<unknown>;
	@Input() actionsTpl: TemplateRef<unknown>;

	@Output() remove = new EventEmitter();

	/**
	 * Angular owns the row, so stop the web component removing itself and let the parent drop it.
	 */
	onDelete(event: Event) {
		event.preventDefault();
		this.remove.emit();
	}
}
