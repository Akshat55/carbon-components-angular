import {
	AfterContentInit,
	ChangeDetectionStrategy,
	Component,
	ContentChildren,
	CUSTOM_ELEMENTS_SCHEMA,
	EventEmitter,
	Input,
	Output,
	QueryList,
	inject
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { Router } from "@angular/router";
import "@carbon/web-components/es/components/breadcrumb/index.js";
import "@carbon/web-components/es/components/overflow-menu/index.js";
import { I18n } from "carbon-components-angular/i18n";
import { BreadcrumbItemComponent } from "./breadcrumb-item.component";
import { BreadcrumbItem } from "./breadcrumb-item.interface";

const MINIMUM_OVERFLOW_THRESHOLD = 4;

/**
 * Wraps the `<cds-breadcrumb>` web component. Use projected `cds-breadcrumb-item`s,
 * or pass `items`; more than `threshold` items collapse into an overflow menu.
 *
 * [See demo](../../?path=/story/components-breadcrumb--basic)
 */
@Component({
	selector: "cds-breadcrumb",
	template: `
		<ng-template #itemContent let-item>
			@if (item?.template) {
				<ng-template [ngTemplateOutlet]="item.template" [ngTemplateOutletContext]="{ $implicit: item }" />
			} @else {
				{{ item?.content }}
			}
		</ng-template>

		@if (!items) {
			<ng-content />
		}
		@for (item of visibleItems; track $index) {
			@if (item === overflowMarker) {
				<cds-breadcrumb-item>
					<cds-breadcrumb-overflow-menu breadcrumb [autoalign]="autoAlign">
						<span slot="tooltip-content">{{ description }}</span>
						<cds-overflow-menu-body>
							@for (overflowItem of overflowItems; track $index) {
								<cds-overflow-menu-item [href]="overflowItem.href" (click)="navigate($event, overflowItem)">
									<ng-container *ngTemplateOutlet="itemContent; context: { $implicit: overflowItem }" />
								</cds-overflow-menu-item>
							}
						</cds-overflow-menu-body>
					</cds-breadcrumb-overflow-menu>
				</cds-breadcrumb-item>
			} @else {
				<cds-breadcrumb-item
					[href]="item.href"
					[route]="item.route"
					[routeExtras]="item.routeExtras"
					[current]="item.current"
					[ariaCurrent]="item.ariaCurrent"
					[skeleton]="skeleton"
					(navigation)="navigation.emit($event)">
					<ng-container *ngTemplateOutlet="itemContent; context: { $implicit: item }" />
				</cds-breadcrumb-item>
			}
		}
	`,
	host: {
		"[noTrailingSlash]": "noTrailingSlash",
		"[size]": "size",
		"[attr.aria-label]": "ariaLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [BreadcrumbItemComponent, NgTemplateOutlet],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Breadcrumb implements AfterContentInit {
	public i18n = inject(I18n);
	public router = inject(Router, { optional: true });

	@ContentChildren(BreadcrumbItemComponent) children: QueryList<BreadcrumbItemComponent>;

	@Input() items: Array<BreadcrumbItem>;
	@Input() noTrailingSlash = false;
	@Input() size: "sm" | "md" = "md";
	@Input() ariaLabel: string = this.i18n.get().BREADCRUMB.LABEL;
	@Input() autoAlign = false;
	/**
	 * Tooltip text for the overflow menu.
	 */
	@Input() description: string = this.i18n.get().BREADCRUMB.OVERFLOW_MENU_DESCRIPTION;

	@Input() set skeleton(value: boolean) {
		this._skeleton = value;
		this.updateChildren();
	}
	get skeleton(): boolean {
		return this._skeleton;
	}

	/**
	 * Number of `items` shown before the middle ones collapse into an overflow menu (minimum 4).
	 */
	@Input() set threshold(threshold: number) {
		this._threshold = isNaN(threshold) || threshold < MINIMUM_OVERFLOW_THRESHOLD ? MINIMUM_OVERFLOW_THRESHOLD : threshold;
	}
	get threshold(): number {
		return this._threshold;
	}

	@Output() navigation = new EventEmitter<Promise<boolean>>();

	protected readonly overflowMarker = {} as BreadcrumbItem;
	protected _threshold: number;
	protected _skeleton = false;

	get shouldShowOverflow() {
		return !!this.items && this.items.length > this.threshold;
	}

	/**
	 * Items in render order; the overflow menu sits between the first and the last two.
	 */
	get visibleItems(): BreadcrumbItem[] {
		if (!this.items) {
			return [];
		}
		if (!this.shouldShowOverflow) {
			return this.items;
		}
		return [this.items[0], this.overflowMarker, ...this.items.slice(-2)];
	}

	get overflowItems(): BreadcrumbItem[] {
		return this.shouldShowOverflow ? this.items.slice(1, -2) : [];
	}

	ngAfterContentInit() {
		this.updateChildren();
	}

	navigate(event: Event, item: BreadcrumbItem) {
		if (this.router && item.route) {
			event.preventDefault();
			this.navigation.emit(this.router.navigate(item.route, item.routeExtras));
		}
	}

	protected updateChildren() {
		this.children?.forEach(child => child.skeleton = this.skeleton);
	}
}
