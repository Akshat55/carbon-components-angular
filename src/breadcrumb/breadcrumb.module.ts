import { NgModule } from "@angular/core";
import { Breadcrumb } from "./breadcrumb.component";
import { BreadcrumbItemComponent } from "./breadcrumb-item.component";
import { BreadcrumbLink, BreadcrumbOverflowMenu, BreadcrumbSkeleton } from "./breadcrumb-parts.component";

/**
 * Importing this module (or the standalone components) registers the breadcrumb web components.
 */
@NgModule({
	imports: [Breadcrumb, BreadcrumbItemComponent, BreadcrumbLink, BreadcrumbOverflowMenu, BreadcrumbSkeleton],
	exports: [Breadcrumb, BreadcrumbItemComponent, BreadcrumbLink, BreadcrumbOverflowMenu, BreadcrumbSkeleton]
})
export class BreadcrumbModule {}
