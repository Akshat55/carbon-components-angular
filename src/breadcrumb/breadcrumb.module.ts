import { NgModule } from "@angular/core";
import { Breadcrumb } from "./breadcrumb.component";
import { BreadcrumbItemComponent } from "./breadcrumb-item.component";

/**
 * Importing this module (or the standalone components) registers the breadcrumb web components.
 */
@NgModule({
	imports: [Breadcrumb, BreadcrumbItemComponent],
	exports: [Breadcrumb, BreadcrumbItemComponent]
})
export class BreadcrumbModule {}
