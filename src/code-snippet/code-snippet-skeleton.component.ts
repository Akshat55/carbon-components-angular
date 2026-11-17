import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/code-snippet/index.js";

/**
 * Loading state of a code snippet.
 *
 * Adds Angular inputs to the `<cds-code-snippet-skeleton>` web component. Importing it registers the web component.
 */
@Component({
	selector: "cds-code-snippet-skeleton",
	template: "<ng-content />",
	host: {
		"[type]": "type ?? element.type"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CodeSnippetSkeleton {
	@Input() type: "single" | "multi";

	protected element = inject(ElementRef).nativeElement;
}
