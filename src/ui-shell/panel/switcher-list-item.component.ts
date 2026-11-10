import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";
import { ShellLink } from "../shell-link.class";

/**
 * A product switcher item. Renders the `<cds-switcher-item>` web component.
 */
@Component({
	selector: "cds-switcher-list-item",
	template: `
		<cds-switcher-item [href]="href ?? ''" [selected]="active" [attr.target]="target" (click)="navigate($event)">
			<ng-content />
		</cds-switcher-item>
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwitcherListItem extends ShellLink {
	@Input() active = false;
	@Input() target: string;
}
