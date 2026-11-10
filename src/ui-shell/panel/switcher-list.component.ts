import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";

/**
 * A product switcher. Renders the `<cds-switcher>` web component.
 */
@Component({
	selector: "cds-switcher-list",
	template: `
		<cds-switcher [ariaLabel]="ariaLabel">
			<ng-content />
		</cds-switcher>
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwitcherList {
	@Input() ariaLabel = "Switcher";
}
