import { NgModule } from "@angular/core";
import { CdsLink } from "./link.component";
import { LinkIconDirective } from "./link-icon.directive";

@NgModule({
	exports: [CdsLink, LinkIconDirective],
	imports: [CdsLink, LinkIconDirective]
})
export class LinkModule {}
