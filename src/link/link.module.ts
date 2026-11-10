import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Link } from "./link.directive";
import { CdsLink } from "./link.component";
import { LinkIconDirective } from "./link-icon.directive";

@NgModule({
	exports: [
		Link,
		CdsLink,
		LinkIconDirective
	],
	imports: [
		CommonModule,
		Link,
		CdsLink,
		LinkIconDirective
	]
})
export class LinkModule {}
