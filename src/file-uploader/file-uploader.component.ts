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
import { provideValueAccessor, WebComponentValueAccessor } from "carbon-components-angular/utils";
import { FileComponent } from "./file.component";
import { FileItem } from "./file-item.interface";

/**
 * Wraps the `<cds-file-uploader>` web component. The value (`files` / `ngModel`) is a `Set<FileItem>`;
 * update an item's `state` to `"upload"` or `"complete"` to show progress.
 *
 * [See demo](../../?path=/story/components-file-uploader--basic)
 */
@Component({
	selector: "cds-file-uploader",
	template: `
		@if (drop) {
			<cds-file-uploader-drop-container
				slot="drop-container"
				[accept]="acceptValue"
				[multiple]="multiple"
				[disabled]="disabled"
				(cds-file-uploader-drop-container-changed)="onFilesAdded($event)">
				@if (isTemplate(dropText)) {
					<ng-template [ngTemplateOutlet]="dropText" />
				} @else {
					{{ dropText }}
				}
			</cds-file-uploader-drop-container>
		} @else {
			<cds-file-uploader-button
				[buttonKind]="buttonType.replace('--', '-')"
				[size]="size"
				[accept]="acceptValue"
				[multiple]="multiple"
				[disabled]="disabled"
				(cds-file-uploader-button-changed)="onFilesAdded($event)">
				{{ buttonText }}
			</cds-file-uploader-button>
		}
		@for (fileItem of files; track fileItem) {
			<cds-file-uploader-item
				[fileItem]="fileItem"
				[nameTpl]="fileNameTpl"
				[actionsTpl]="fileActionsTpl"
				[size]="fileItemSize"
				(remove)="removeFile(fileItem)" />
		}
	`,
	host: {
		"[id]": "fileUploaderId",
		"[labelTitle]": "title",
		"[labelDescription]": "description",
		"[disabled]": "disabled"
	},
	providers: [provideValueAccessor(() => FileUploader)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, FileComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FileUploader extends WebComponentValueAccessor<Set<FileItem>> {
	static fileUploaderCount = 0;

	public i18n = inject(I18n);

	@Input() buttonText = this.i18n.get().FILE_UPLOADER.OPEN;
	@Input() buttonType:
		| "primary"
		| "secondary"
		| "tertiary"
		| "ghost"
		| "danger"
		| "danger--primary"
		| "danger--tertiary"
		| "danger--ghost" = "primary";
	@Input() title: string;
	@Input() description: string;
	/**
	 * Accepted extensions (`.png`) or MIME types (`image/png`).
	 */
	@Input() accept: string[] | string = [];
	@Input() multiple = true;
	@Input() size: "sm" | "md" | "lg";
	@Input() fileItemSize: "sm" | "md" | "lg" = "lg";
	/**
	 * Shows a drag and drop area instead of a button.
	 */
	@Input() drop = false;
	@Input() dropText: string | TemplateRef<any>;
	@Input() fileUploaderId = `file-uploader-${FileUploader.fileUploaderCount++}`;
	@Input() files = new Set<FileItem>();
	/**
	 * Template for the file name, with the `FileItem` as `$implicit`.
	 */
	@Input() fileNameTpl: TemplateRef<unknown>;
	/**
	 * Template for the file actions, with the `FileItem` as `$implicit`.
	 */
	@Input() fileActionsTpl: TemplateRef<unknown>;
	/**
	 * @deprecated use `<cds-file-uploader-skeleton>` instead.
	 */
	@Input() skeleton = false;

	@Output() filesChange = new EventEmitter<any>();

	/**
	 * `accept` as the web component expects it (a string).
	 */
	get acceptValue() {
		return Array.isArray(this.accept) ? this.accept.join(",") : this.accept ?? "";
	}

	get value(): Set<FileItem> {
		return this.files;
	}
	set value(files: Set<FileItem>) {
		if (files !== this.files) {
			this.files = files;
			this.onChange(files);
		}
	}

	writeValue(files: Set<FileItem>) {
		this.files = files ?? new Set();
		this.changeDetectorRef.markForCheck();
	}

	createFileItem(file: File): FileItem {
		return { uploaded: false, state: "edit", invalid: false, invalidText: "", file };
	}

	onFilesAdded(event: Event) {
		const added: File[] = (event as CustomEvent<{ addedFiles: File[] }>).detail.addedFiles;
		const files = new Set<FileItem>(this.multiple ? this.files : []);
		added.slice(0, this.multiple ? added.length : 1).forEach(file => files.add(this.createFileItem(file)));
		this.value = files;
		this.filesChange.emit(files);
	}

	removeFile(fileItem: FileItem) {
		if (this.files?.has(fileItem)) {
			const files = new Set<FileItem>(this.files);
			files.delete(fileItem);
			this.value = files;
			this.filesChange.emit(files);
		}
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
