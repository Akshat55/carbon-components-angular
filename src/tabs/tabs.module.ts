import { NgModule } from "@angular/core";

import { TabItemSkeleton, TabSkeleton } from "./tab-skeleton.component";
import { Tabs } from "./tabs.component";
import { TabsVertical } from "./tabs-vertical.component";
import { Tab } from "./tab.component";

@NgModule({
	exports: [
		Tabs,
		TabsVertical,
		Tab,
		TabSkeleton,
		TabItemSkeleton
	],
	imports: [
		Tabs,
		TabsVertical,
		Tab,
		TabSkeleton,
		TabItemSkeleton
	]
})
export class TabsModule {}
