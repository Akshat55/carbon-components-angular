import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/code-snippet/index.js";
import { BaseIconButton } from "carbon-components-angular/button";
import { I18n } from "carbon-components-angular/i18n";

export enum SnippetType {
	single = "single",
	multi = "multi",
	inline = "inline"
}

/**
 * Wraps the `<cds-code-snippet>` web component. The code goes in the default slot.
 *
 * ```html
 * <cds-code-snippet display="multi">{{ code }}</cds-code-snippet>
 * ```
 *
 * [See demo](../../?path=/story/components-code-snippet--basic)
 */
@Component({
	selector: "cds-code-snippet",
	template: `<ng-content />`,
	host: {
		"[type]": "display",
		"[disabled]": "disabled",
		"[hideCopyButton]": "hideCopyButton",
		"[wrapText]": "wrapText",
		"[tooltipContent]": "copyButtonDescription || translations.COPY_CODE",
		"[feedback]": "feedbackText",
		"[feedbackTimeout]": "feedbackTimeout",
		"[showMoreText]": "translations.SHOW_MORE",
		"[showLessText]": "translations.SHOW_LESS",
		"[maxCollapsedNumberOfRows]": "maxCollapsedNumberOfRows",
		"[minCollapsedNumberOfRows]": "minCollapsedNumberOfRows",
		"[maxExpandedNumberOfRows]": "maxExpandedNumberOfRows",
		"[minExpandedNumberOfRows]": "minExpandedNumberOfRows"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CodeSnippet extends BaseIconButton {
	public i18n = inject(I18n);

	@Input() display: SnippetType = SnippetType.single;
	@Input() translations = this.i18n.get().CODE_SNIPPET;
	/**
	 * Tooltip text for the copy button.
	 */
	@Input() copyButtonDescription: string;
	@Input() hideCopyButton = false;
	@Input() disabled = false;
	@Input() maxCollapsedNumberOfRows = 15;
	@Input() minCollapsedNumberOfRows = 3;
	@Input() maxExpandedNumberOfRows = 0;
	@Input() minExpandedNumberOfRows = 16;
	@Input() wrapText = false;
	/**
	 * Text shown after the code is copied.
	 */
	@Input() feedbackText = this.translations.COPIED;
	/**
	 * Milliseconds the copy feedback stays visible.
	 */
	@Input() feedbackTimeout = 2000;
	/**
	 * @deprecated the web component follows the surrounding theme / layer.
	 */
	@Input() theme: "light" | "dark" = "dark";
	/**
	 * @deprecated the web component manages its own expanded state.
	 */
	@Input() expanded = false;
	/**
	 * @deprecated use `<cds-code-snippet-skeleton>` instead.
	 */
	@Input() skeleton = false;
}
