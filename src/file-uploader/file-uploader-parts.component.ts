import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/file-uploader/index.js";

/**
 * Adds Angular inputs and outputs to the `<cds-file-uploader-button>` web component: a button that
 * opens the file browser. Importing it registers the web component.
 *
 * `cds-file-uploader` renders one for you; write it yourself to build a custom uploader.
 *
 * ```html
 * <cds-file-uploader-button accept=".jpg" [multiple]="true" (filesAdded)="add($event)">Add file</cds-file-uploader-button>
 * ```
 */
@Component({
	selector: "cds-file-uploader-button",
	template: "<ng-content />",
	host: {
		"[accept]": "accept ?? element.accept",
		"[buttonKind]": "buttonKind ?? element.buttonKind",
		"[size]": "size ?? element.size",
		"[multiple]": "multiple ?? element.multiple",
		"[disabled]": "disabled ?? element.disabled",
		"[name]": "name ?? element.name",
		"(cds-file-uploader-button-changed)": "filesAdded.emit($event.detail.addedFiles)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FileUploaderButton {
	/**
	 * File types to accept, e.g. `".jpg .png"`.
	 */
	@Input() accept: string;
	@Input() buttonKind: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
	@Input() size: "sm" | "md" | "lg";
	@Input({ transform: booleanAttribute }) multiple?: boolean;
	/**
	 * A `cds-file-uploader` passes its own `disabled` on.
	 */
	@Input({ transform: booleanAttribute }) disabled?: boolean;
	@Input() name: string;

	/**
	 * Emits the files the user picked.
	 */
	@Output() filesAdded = new EventEmitter<File[]>();

	protected element = inject(ElementRef).nativeElement;
}

/**
 * Adds Angular inputs and outputs to the `<cds-file-uploader-drop-container>` web component: an area
 * files can be dropped on or clicked to browse. Importing it registers the web component.
 *
 * ```html
 * <cds-file-uploader-drop-container accept=".jpg" (filesAdded)="add($event)">Drag and drop files here</cds-file-uploader-drop-container>
 * ```
 */
@Component({
	selector: "cds-file-uploader-drop-container",
	template: "<ng-content />",
	host: {
		"[accept]": "accept ?? element.accept",
		"[multiple]": "multiple ?? element.multiple",
		"[disabled]": "disabled ?? element.disabled",
		"[name]": "name ?? element.name",
		"(cds-file-uploader-drop-container-changed)": "filesAdded.emit($event.detail.addedFiles)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FileUploaderDropContainer {
	/**
	 * File types to accept, e.g. `".jpg .png"`.
	 */
	@Input() accept: string;
	@Input({ transform: booleanAttribute }) multiple?: boolean;
	/**
	 * A `cds-file-uploader` passes its own `disabled` on.
	 */
	@Input({ transform: booleanAttribute }) disabled?: boolean;
	@Input() name: string;

	/**
	 * Emits the files the user dropped or picked.
	 */
	@Output() filesAdded = new EventEmitter<File[]>();

	protected element = inject(ElementRef).nativeElement;
}
