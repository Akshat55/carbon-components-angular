import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	TemplateRef
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/icon-button/index.js";
import { BaseIconButton } from "./base-icon-button.component";
import { ButtonSize, ButtonType } from "./button.types";

/**
 * Wraps the `<cds-icon-button>` web component. The projected icon is placed in the icon slot and
 * `description` is shown as the tooltip. Listen to clicks with `(click)`.
 *
 * ```html
 * <cds-icon-button kind="ghost" description="Add">
 * 	<svg cdsIcon="add" size="16"></svg>
 * </cds-icon-button>
 * ```
 *
 * [See demo](../../?path=/story/components-button-icon-button--basic)
 */
@Component({
	selector: "cds-icon-button",
	template: `
		<span slot="icon"><ng-content /></span>
		@if (description && (!disabled || showTooltipWhenDisabled)) {
			<span slot="tooltip-content">
				@if (isTemplate(description)) {
					<ng-template [ngTemplateOutlet]="description" />
				} @else {
					{{ description }}
				}
			</span>
		}
	`,
	host: {
		"[id]": "buttonId",
		"[kind]": "kind.replace('--', '-')",
		"[size]": "size",
		"[type]": "type",
		"[isExpressive]": "isExpressive",
		"[disabled]": "disabled",
		"[align]": "align",
		"[autoalign]": "autoAlign",
		"[defaultOpen]": "isOpen",
		"[enterDelayMs]": "enterDelayMs",
		"[leaveDelayMs]": "leaveDelayMs",
		"[buttonClassName]": "buttonClassName"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IconButton extends BaseIconButton {
	static iconButtonCounter = 0;

	@Input() buttonId = `icon-btn-${IconButton.iconButtonCounter++}`;
	@Input() kind: ButtonType = "primary";
	@Input() size: ButtonSize = "lg";
	@Input() type = "button";
	@Input() isExpressive = false;
	@Input() disabled = false;
	/**
	 * Tooltip text.
	 */
	@Input() description: string | TemplateRef<any>;
	@Input() showTooltipWhenDisabled = false;

	/**
	 * Extra classes for the inner `<button>`, as `{ className: boolean }`.
	 */
	@Input() buttonNgClass: { [key: string]: boolean } = {};
	/**
	 * @deprecated the inner `<button>` is in the web component's shadow DOM. Set `aria-*`
	 * attributes on `cds-icon-button` instead.
	 */
	@Input() buttonAttributes: { [key: string]: string } = {};

	get buttonClassName() {
		return Object.keys(this.buttonNgClass ?? {}).filter(name => this.buttonNgClass[name]).join(" ");
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
