/**
 * Copyright IBM Corp. 2024
 *
 * Directives for the file-uploader web components.
 *
 * Replaces the old Angular FileUploader component with thin directives on
 * <cds-file-uploader> and its child elements:
 *
 *   <cds-file-uploader [title]="'Account photo'" [description]="'Only .jpg files'">
 *     <cds-file-uploader-drop-container [accept]="['.jpg']" [multiple]="true">
 *       Drag and drop files here or click to upload
 *     </cds-file-uploader-drop-container>
 *   </cds-file-uploader>
 *
 * Backwards-compatible API surface:
 *   [title]       → label-title attribute
 *   [description] → label-description attribute
 *   [disabled]    → disabled attribute
 *   (filesChange) ← bridged from the drop-container/button change events
 */
import {
	Directive,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	Output
} from "@angular/core";

@Directive({
	selector: "cds-file-uploader, [cdsFileUploader], [ibmFileUploader]",
	standalone: true
})
export class CdsFileUploaderDirective implements OnChanges {
	/** Title text above the uploader. */
	@Input() title: string;

	/** Description text under the title. */
	@Input() description: string;

	/** Set to `true` to disable the uploader. */
	@Input() disabled = false;

	/** Emits the list of added files whenever the selection changes. */
	@Output() filesChange = new EventEmitter<any>();

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		if (this.title) {
			el.setAttribute("label-title", this.title);
		}
		if (this.description) {
			el.setAttribute("label-description", this.description);
		}
		if (this.disabled) {
			el.setAttribute("disabled", "");
		} else {
			el.removeAttribute("disabled");
		}
	}

	@HostListener("cds-file-uploader-drop-container-changed", ["$event"])
	@HostListener("cds-file-uploader-button-changed", ["$event"])
	onFilesChanged(event: CustomEvent): void {
		this.filesChange.emit(event.detail?.addedFiles ?? event.detail);
	}
}

@Directive({
	selector: "cds-file-uploader-drop-container, cds-file-uploader-button, [cdsFileUploaderButton]",
	standalone: true
})
export class CdsFileUploaderButtonDirective implements OnChanges {
	/** Accepted file extensions/MIME types. */
	@Input() accept: string[] | string = [];

	/** Allow multiple files. */
	@Input() multiple = true;

	/** Set to `true` to disable this control. */
	@Input() disabled = false;

	constructor(private _el: ElementRef<HTMLElement>) { }

	ngOnChanges(): void {
		const el = this._el.nativeElement;

		const accept = Array.isArray(this.accept) ? this.accept.join(",") : this.accept;
		if (accept) {
			el.setAttribute("accept", accept);
		}

		if (this.multiple) {
			el.setAttribute("multiple", "");
		} else {
			el.removeAttribute("multiple");
		}
		if (this.disabled) {
			el.setAttribute("disabled", "");
		} else {
			el.removeAttribute("disabled");
		}
	}
}
