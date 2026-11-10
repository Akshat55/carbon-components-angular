import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output
} from "@angular/core";
import "@carbon/web-components/es/components/overflow-menu/index.js";

/**
 * Possible link targets for `href` options.
 */
export enum Target {
	self = "_self",
	blank = "_blank",
	parent = "_parent",
	top = "_top"
}

/**
 * An option of `cds-overflow-menu`. Renders the `<cds-overflow-menu-item>` web component.
 */
@Component({
	selector: "cds-overflow-menu-option",
	template: `
		<cds-overflow-menu-item
			[danger]="type === 'danger'"
			[disabled]="disabled"
			[divider]="divider"
			[href]="href ?? ''"
			[attr.target]="target"
			[class]="innerClass"
			(click)="onClick($event)">
			<ng-content />
		</cds-overflow-menu-item>
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OverflowMenuOption {
	@Input() type: "normal" | "danger" = "normal";
	@Input() disabled = false;
	/**
	 * Renders the option as a link.
	 */
	@Input() href: string;
	@Input() target: Target;
	/**
	 * Draws a divider above the option.
	 */
	@Input() divider = false;
	@Input() innerClass = "";

	/**
	 * Emits when the option is chosen.
	 */
	@Output() selected: EventEmitter<any> = new EventEmitter();

	onClick(event: Event) {
		if (!this.disabled) {
			this.selected.emit(event);
		}
	}
}
