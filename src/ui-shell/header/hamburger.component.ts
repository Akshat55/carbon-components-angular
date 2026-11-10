import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { I18n } from "carbon-components-angular/i18n";

/**
 * The header menu button. Renders the `<cds-header-menu-button>` web component.
 */
@Component({
	selector: "cds-hamburger",
	template: `
		<cds-header-menu-button
			[active]="active"
			[buttonLabelActive]="activeTitle"
			[buttonLabelInactive]="inactiveTitle"
			(cds-header-menu-button-toggled)="onToggled($event)" />
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Hamburger {
	public i18n = inject(I18n);

	@Input() active = false;
	@Input() activeTitle = this.i18n.get().UI_SHELL.HEADER.CLOSE_MENU;
	@Input() inactiveTitle = this.i18n.get().UI_SHELL.HEADER.OPEN_MENU;

	/**
	 * Emits the click event when the button is toggled.
	 */
	@Output() selected = new EventEmitter<Object>();

	onToggled(event: Event) {
		this.active = (event as CustomEvent<{ active: boolean }>).detail.active;
		this.selected.emit(event);
	}
}
