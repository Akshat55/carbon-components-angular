import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { BaseIconButton } from "carbon-components-angular/button";

/**
 * Adds `[(active)]` and a `description` tooltip to the `<cds-header-global-action>` web component; project the icon.
 * Supports `[(active)]`.
 */
@Component({
	selector: "cds-header-global-action",
	template: `
		<ng-content />
		@if (description) {
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
		"[active]": "active",
		"[attr.aria-label]": "ariaLabel",
		"[buttonLabelActive]": "ariaLabel",
		"[buttonLabelInactive]": "ariaLabel",
		"(click)": "onClick()"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderAction extends BaseIconButton {
	/**
	 * Tooltip text.
	 */
	@Input() description: string | TemplateRef<any>;
	@Input() ariaLabel: string;
	@Input() active = false;

	@Output() activeChange = new EventEmitter<boolean>();
	/**
	 * Emits the new `active` value on click.
	 */
	@Output() selected = new EventEmitter<boolean>();

	onClick() {
		this.active = !this.active;
		this.selected.emit(this.active);
		this.activeChange.emit(this.active);
	}

	isTemplate(value: unknown): value is TemplateRef<any> {
		return value instanceof TemplateRef;
	}
}
