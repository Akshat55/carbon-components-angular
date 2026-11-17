import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IconDirective } from "carbon-components-angular/icon";

import { ContextMenuDividerComponent } from "./context-menu-divider.component";
import { ContextMenuGroupComponent } from "./context-menu-group.component";
import { ContextMenuItemComponent } from "./context-menu-item.component";
import { ContextMenuComponent } from "./context-menu.component";
import { MenuItemRadioGroup, MenuItemSelectable } from "./menu-item-selectable.component";

@NgModule({
	exports: [
		ContextMenuDividerComponent,
		ContextMenuGroupComponent,
		ContextMenuItemComponent,
		ContextMenuComponent,
		MenuItemSelectable,
		MenuItemRadioGroup
	],
	imports: [
		CommonModule,
		IconDirective,
		ContextMenuDividerComponent,
		ContextMenuGroupComponent,
		ContextMenuItemComponent,
		ContextMenuComponent,
		MenuItemSelectable,
		MenuItemRadioGroup
	]
})
export class ContextMenuModule {}
