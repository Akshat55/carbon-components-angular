import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input
} from "@angular/core";
import "@carbon/web-components/es/components/ui-shell/index.js";

/**
 * A header panel. Renders the `<cds-header-panel>` web component.
 */
@Component({
	selector: "cds-panel",
	template: `
		<cds-header-panel [expanded]="expanded" [attr.aria-label]="ariaLabel">
			<ng-content />
		</cds-header-panel>
	`,
	styles: [":host { display: contents; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Panel {
	@Input() expanded = false;
	@Input() ariaLabel: string;
}
