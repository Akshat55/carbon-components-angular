import { NgModule } from "@angular/core";

import { OverflowMenu } from "./overflow-menu.component";
import { OverflowMenuOption } from "./overflow-menu-option.component";
import { OverflowMenuBody } from "./overflow-menu-body.component";

/**
 * Exports the `cds-overflow-menu`, `cds-overflow-menu-body` and `cds-overflow-menu-item` wrappers.
 */
@NgModule({
	imports: [OverflowMenu, OverflowMenuOption, OverflowMenuBody],
	exports: [OverflowMenu, OverflowMenuOption, OverflowMenuBody]
})
export class OverflowMenuModule {}
