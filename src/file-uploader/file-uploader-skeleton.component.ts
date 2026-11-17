import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import "@carbon/web-components/es/components/file-uploader/index.js";

/**
 * Loading state of a file uploader.
 *
 * Angular class for the `<cds-file-uploader-skeleton>` web component, so templates can use it without
 * `CUSTOM_ELEMENTS_SCHEMA`. Importing it registers the web component.
 */
@Component({
	selector: "cds-file-uploader-skeleton",
	template: "<ng-content />",
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FileUploaderSkeleton {}
