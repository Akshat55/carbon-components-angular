import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { Router } from "@angular/router";
import "@carbon/web-components/es/components/breadcrumb/index.js";

/**
 * Wraps the `<cds-breadcrumb-item>` web component. With `href` or `route` the content is
 * rendered inside a `<cds-breadcrumb-link>`; `route` navigates with the Angular router.
 *
 * [See demo](../../?path=/story/components-breadcrumb--basic)
 */
@Component({
	selector: "cds-breadcrumb-item",
	template: `
		<ng-template #content><ng-content /></ng-template>
		@if (useLink()) {
			<cds-breadcrumb-link
				[href]="skeleton ? '/#' : href"
				[isCurrentPage]="current"
				[ariaCurrent]="current ? ariaCurrent : null"
				(click)="navigate($event)">
				<ng-container *ngTemplateOutlet="content" />
			</cds-breadcrumb-link>
		} @else {
			<ng-container *ngTemplateOutlet="content" />
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BreadcrumbItemComponent {
	@Input() href: string;
	/**
	 * Angular router commands, used instead of `href`.
	 */
	@Input() route: any[];
	@Input() routeExtras: any;
	@Input() ariaCurrent = "page";
	@Input() current = false;

	@Input() set skeleton(value: boolean) {
		this._skeleton = value;
		this.changeDetectorRef.markForCheck();
	}
	get skeleton() {
		return this._skeleton;
	}

	/**
	 * Emits the router's navigation promise when `route` is used.
	 */
	@Output() navigation = new EventEmitter<Promise<boolean>>();

	protected changeDetectorRef = inject(ChangeDetectorRef);
	protected router = inject(Router, { optional: true });
	protected _skeleton = false;

	useLink() {
		return this.skeleton || this.href || this.route;
	}

	navigate(event: Event) {
		if (this.router && this.route) {
			event.preventDefault();
			this.navigation.emit(this.router.navigate(this.route, this.routeExtras));
		}
	}
}
