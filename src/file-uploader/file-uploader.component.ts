import {
	booleanAttribute,
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
import { observeChildren, provideValueAccessor, WebComponentValueAccessor } from "carbon-components-angular/utils";
import { FileComponent } from "./file.component";
import { FileItem } from "./file-item.interface";

/**
 * Adds Angular inputs and outputs to the `<cds-file-uploader>` web component. The value (`files` / `ngModel`) is a `Set<FileItem>`;
 * update an item's `state` to `"upload"` or `"complete"` to show progress.
 *
 * [See demo](../../?path=/story/components-file-uploader--basic)
 */
@Component({
	selector: "cds-file-uploader",
	template: `
		<ng-content />
		@if (!hasOwnTrigger) {
		@if (drop) {
			<cds-file-uploader-drop-container
				data-cds-generated
				slot="drop-container"
				[accept]="acceptValue"
				[multiple]="multiple"
				[disabled]="!!disabled">
				@if (isTemplate(dropText)) {
					<ng-template [ngTemplateOutlet]="dropText" />
				} @else {
					{{ dropText }}
				}
			</cds-file-uploader-drop-container>
		} @else {
			<cds-file-uploader-button
				data-cds-generated
				[buttonKind]="buttonType.replace('--', '-')"
				[size]="size || 'md'"
				[accept]="acceptValue"
				[multiple]="multiple"
				[disabled]="!!disabled">
				{{ buttonText }}
			</cds-file-uploader-button>
		}
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
		"[labelTitle]": "title ?? element.labelTitle",
		"[labelDescription]": "description ?? element.labelDescription",
		"[disabled]": "disabled ?? element.disabled",
		"(cds-file-uploader-button-changed)": "onFilesAdded($event)",
		"(cds-file-uploader-drop-container-changed)": "onFilesAdded($event)"
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
	@Input({ transform: booleanAttribute }) multiple = true;
	@Input() size: "sm" | "md" | "lg";
	@Input() fileItemSize: "sm" | "md" | "lg" = "lg";
	/**
	 * Shows a drag and drop area instead of a button.
	 */
	@Input({ transform: booleanAttribute }) drop = false;
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
	@Input({ transform: booleanAttribute }) skeleton = false;

	@Output() filesChange = new EventEmitter<any>();

	/**
	 * Whether the consumer wrote its own `cds-file-uploader-button` or drop container. The web
	 * component needs one from its first render, so the rendered one is only removed once known.
	 */
	protected hasOwnTrigger = false;

	constructor() {
		super();
		observeChildren(this.element, () => {
			const hasOwnTrigger = Array.from<Element>(this.element.children).some(child =>
				["cds-file-uploader-button", "cds-file-uploader-drop-container"].includes(child.localName)
				&& !child.hasAttribute("data-cds-generated"));
			if (hasOwnTrigger !== this.hasOwnTrigger) {
				this.hasOwnTrigger = hasOwnTrigger;
				this.changeDetectorRef.markForCheck();
			}
		});
	}

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
