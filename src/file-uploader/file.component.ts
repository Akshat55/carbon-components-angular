import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject,
	ElementRef
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
		"[state]": "fileItem ? (fileItem.state === 'upload' ? 'uploading' : fileItem.state) : element.state",
		"[size]": "size ?? element.size",
		"[invalid]": "fileItem ? !!fileItem.invalid : element.invalid",
		"[errorSubject]": "fileItem ? (fileItem.invalidTitle ?? '') : element.errorSubject",
		"[errorBody]": "fileItem ? (fileItem.invalidText ?? '') : element.errorBody",
		"[iconDescription]": "translations.REMOVE_BUTTON",
		"[title]": "fileItem ? fileItem.file.name : element.title",
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
	/**
	 * The web component's default is `"md"` (a `cds-file-uploader` uses its `fileItemSize`, `"lg"`).
	 */
	@Input() size?: "sm" | "md" | "lg";
	@Input() nameTpl: TemplateRef<unknown>;
	@Input() actionsTpl: TemplateRef<unknown>;

	@Output() remove = new EventEmitter();

	protected element = inject(ElementRef).nativeElement;

	/**
	 * Angular owns the row, so stop the web component removing itself and let the parent drop it.
	 */
	onDelete(event: Event) {
		event.preventDefault();
		this.remove.emit();
	}
}
