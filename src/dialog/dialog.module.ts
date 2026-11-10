// modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// imports
import { DialogService } from "./dialog.service";
import { Dialog } from "./dialog.component";
import { DialogDirective } from "./dialog.directive";

import { OverflowMenu } from "./overflow-menu/overflow-menu.component";
import { OverflowMenuPane } from "./overflow-menu/overflow-menu-pane.component";
import { OverflowMenuDirective } from "./overflow-menu/overflow-menu.directive";
import { OverflowMenuOption } from "./overflow-menu/overflow-menu-option.component";
import { OverflowMenuBody } from "./overflow-menu/overflow-menu-body.component";
import { I18nModule } from "carbon-components-angular/i18n";
import { Placeholder } from "carbon-components-angular/placeholder";
import { ExperimentalModule } from "carbon-components-angular/experimental";
import { UtilsModule } from "carbon-components-angular/utils";
import { IconDirective } from "carbon-components-angular/icon";



@NgModule({
	exports: [
		Dialog,
		OverflowMenu,
		OverflowMenuPane,
		DialogDirective,
		OverflowMenuDirective,
		OverflowMenuOption,
		OverflowMenuBody
	],
	providers: [DialogService],
	imports: [
		CommonModule,
		I18nModule,
		Placeholder,
		ExperimentalModule,
		UtilsModule,
		IconDirective,
		Dialog,
		OverflowMenu,
		OverflowMenuPane,
		DialogDirective,
		OverflowMenuDirective,
		OverflowMenuOption,
		OverflowMenuBody
	]
})
export class DialogModule {}
