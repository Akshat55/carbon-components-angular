import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
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
 * Adds Angular inputs and outputs to the `<cds-code-snippet>` web component. The code goes in the default slot.
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
		"[type]": "display ?? element.type",
		"[disabled]": "disabled ?? element.disabled",
		"[hideCopyButton]": "hideCopyButton ?? element.hideCopyButton",
		"[wrapText]": "wrapText ?? element.wrapText",
		"[copyText]": "copyText ?? element.copyText",
		"[tooltipContent]": "copyButtonDescription || translations.COPY_CODE",
		"[feedback]": "feedbackText",
		"[feedbackTimeout]": "feedbackTimeout ?? element.feedbackTimeout",
		"[showMoreText]": "translations.SHOW_MORE",
		"[showLessText]": "translations.SHOW_LESS",
		"[maxCollapsedNumberOfRows]": "maxCollapsedNumberOfRows ?? element.maxCollapsedNumberOfRows",
		"[minCollapsedNumberOfRows]": "minCollapsedNumberOfRows ?? element.minCollapsedNumberOfRows",
		"[maxExpandedNumberOfRows]": "maxExpandedNumberOfRows ?? element.maxExpandedNumberOfRows",
		"[minExpandedNumberOfRows]": "minExpandedNumberOfRows ?? element.minExpandedNumberOfRows"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CodeSnippet extends BaseIconButton {
	public i18n = inject(I18n);

	/**
	 * The web component's default is `"single"`.
	 */
	@Input() display?: SnippetType;
	@Input() translations = this.i18n.get().CODE_SNIPPET;
	/**
	 * Tooltip text for the copy button.
	 */
	@Input() copyButtonDescription: string;
	@Input({ transform: booleanAttribute }) hideCopyButton?: boolean;
	@Input({ transform: booleanAttribute }) disabled?: boolean;
	/**
	 * The web component's default is 15.
	 */
	@Input() maxCollapsedNumberOfRows?: number;
	/**
	 * The web component's default is 3.
	 */
	@Input() minCollapsedNumberOfRows?: number;
	/**
	 * The web component's default is 0 (no limit).
	 */
	@Input() maxExpandedNumberOfRows?: number;
	/**
	 * The web component's default is 16.
	 */
	@Input() minExpandedNumberOfRows?: number;
	@Input({ transform: booleanAttribute }) wrapText?: boolean;
	/**
	 * Text copied to the clipboard. Defaults to the snippet's text.
	 */
	@Input() copyText?: string;
	/**
	 * Text shown after the code is copied.
	 */
	@Input() feedbackText = this.translations.COPIED;
	/**
	 * Milliseconds the copy feedback stays visible. The web component's default is 2000.
	 */
	@Input() feedbackTimeout?: number;
	/**
	 * @deprecated the web component follows the surrounding theme / layer.
	 */
	@Input() theme?: "light" | "dark";
	/**
	 * @deprecated the web component manages its own expanded state.
	 */
	@Input({ transform: booleanAttribute }) expanded?: boolean;

	protected element = inject(ElementRef).nativeElement;
}
