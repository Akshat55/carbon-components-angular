import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/icon-button/index.js";
import { BaseIconButton } from "./base-icon-button.component";
import { ButtonSize, ButtonType } from "./button.types";

/**
 * Adds Angular inputs and outputs to the `<cds-icon-button>` web component. The projected icon is placed in the icon slot and
 * `description` is shown as the tooltip. `(click)`, `(focus)` and `(blur)` are the element's own DOM events.
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
		@if (description && (!element.disabled || showTooltipWhenDisabled)) {
			<span slot="tooltip-content" (click)="onTooltipClick($event)">
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
		"[kind]": "kind?.replace('--', '-') ?? element.kind",
		"[size]": "size ?? element.size",
		"[type]": "type ?? element.type",
		"[isExpressive]": "isExpressive ?? element.isExpressive",
		"[disabled]": "disabled ?? element.disabled",
		"[align]": "align ?? element.align",
		"[autoalign]": "autoAlign ?? element.autoalign",
		"[defaultOpen]": "isOpen ?? element.defaultOpen",
		"[enterDelayMs]": "enterDelayMs ?? element.enterDelayMs",
		"[leaveDelayMs]": "leaveDelayMs ?? element.leaveDelayMs",
		"[buttonClassName]": "buttonClassName ?? element.buttonClassName"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IconButton extends BaseIconButton {
	static iconButtonCounter = 0;

	@Input() buttonId = `icon-btn-${IconButton.iconButtonCounter++}`;
	/**
	 * The web component's default is `"primary"`.
	 */
	@Input() kind?: ButtonType;
	/**
	 * The web component's default is `"lg"`.
	 */
	@Input() size?: ButtonSize;
	@Input() type?: "button" | "submit" | "reset";
	@Input({ transform: booleanAttribute }) isExpressive?: boolean;
	@Input({ transform: booleanAttribute }) disabled?: boolean;
	/**
	 * Tooltip text.
	 */
	@Input() description: string | TemplateRef<any>;
	@Input({ transform: booleanAttribute }) showTooltipWhenDisabled = false;

	/**
	 * Extra classes for the inner `<button>`, as `{ className: boolean }`.
	 */
	@Input() buttonNgClass: { [key: string]: boolean } = {};
	/**
	 * @deprecated the inner `<button>` is in the web component's shadow DOM. Set `aria-*`
	 * attributes on `cds-icon-button` instead.
	 */
	@Input() buttonAttributes: { [key: string]: string } = {};

	/**
	 * Emits when the tooltip is clicked. Those clicks don't reach `(click)`.
	 */
	@Output() tooltipClick = new EventEmitter<Event>();

	protected element = inject(ElementRef).nativeElement;

	get buttonClassName() {
		const names = Object.keys(this.buttonNgClass ?? {}).filter(name => this.buttonNgClass[name]);
		return names.length ? names.join(" ") : undefined;
	}

	onTooltipClick(event: Event) {
		event.stopPropagation();
		this.tooltipClick.emit(event);
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
