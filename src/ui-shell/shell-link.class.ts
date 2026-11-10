import {
	ChangeDetectorRef,
	DestroyRef,
	Directive,
	EventEmitter,
	Input,
	Output,
	inject
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

/**
 * Router support shared by the UI shell links: `route` / `routeExtras` navigate with the Angular
 * router, and with `useRouter` an `href` is navigated with the router (and marked current when active).
 */
@Directive()
export abstract class ShellLink {
	@Input() href: string;
	/**
	 * Angular router commands, used instead of `href`.
	 */
	@Input() route: any[];
	@Input() routeExtras: any;
	/**
	 * Navigates `href` with the Angular router instead of a page load.
	 */
	@Input() useRouter = false;

	/**
	 * Emits the router's navigation promise.
	 */
	@Output() navigation = new EventEmitter<Promise<boolean>>();

	protected router = inject(Router, { optional: true });
	protected changeDetectorRef = inject(ChangeDetectorRef);
	/**
	 * `true` while the router's current URL matches `href` (with `useRouter`).
	 */
	protected routerActive = false;

	constructor() {
		this.router?.events.pipe(
			filter(event => event instanceof NavigationEnd),
			takeUntilDestroyed(inject(DestroyRef))
		).subscribe(() => {
			this.routerActive = this.useRouter && !!this.href && this.router.url === this.href;
			this.onRouterActiveChange();
			this.changeDetectorRef.markForCheck();
		});
	}

	navigate(event: Event) {
		if (!this.router) {
			return;
		}
		if (this.route) {
			event.preventDefault();
			this.navigation.emit(this.router.navigate(this.route, this.routeExtras));
		} else if (this.useRouter && this.href) {
			event.preventDefault();
			this.navigation.emit(this.router.navigateByUrl(this.href, this.routeExtras));
		}
	}

	/**
	 * Called when `routerActive` is recalculated.
	 */
	protected onRouterActiveChange() {}
}
