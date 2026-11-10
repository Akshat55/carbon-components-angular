import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	inject
} from "@angular/core";
import { Router } from "@angular/router";
import "@carbon/web-components/es/components/tile/index.js";
import { TemplateSlot } from "carbon-components-angular/utils";

/**
 * Wraps the `<cds-clickable-tile>` web component. `route` navigates with the Angular router.
 *
 * [See demo](../../?path=/story/components-tiles-clickable--basic)
 */
@Component({
	selector: "cds-clickable-tile",
	template: `
		<ng-content />
		<ng-container cdsSlot="decorator" [cdsSlotTemplate]="decorator" />
	`,
	host: {
		"[colorScheme]": "theme === 'light' ? 'light' : ''",
		"[href]": "href",
		"[target]": "target",
		"[rel]": "rel",
		"[disabled]": "disabled",
		"[hasRoundedCorners]": "hasRoundedCorners",
		"(click)": "navigate($event)"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TemplateSlot],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClickableTile {
	@Input() theme: "light" | "dark" = "dark";
	@Input() href = "#";
	@Input() target: string;
	@Input() rel: string;
	@Input() disabled = false;
	@Input() decorator: TemplateRef<any>;
	@Input() hasRoundedCorners = false;
	/**
	 * Angular router commands, used instead of `href`.
	 */
	@Input() route: any[];
	@Input() routeExtras: any;

	@Output() navigation = new EventEmitter<Promise<boolean>>();

	protected router = inject(Router, { optional: true });

	navigate(event: Event) {
		if (this.router && this.route && !this.disabled) {
			event.preventDefault();
			this.navigation.emit(this.router.navigate(this.route, this.routeExtras));
		}
	}
}
