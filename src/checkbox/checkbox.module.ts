import { NgModule } from "@angular/core";
import { Checkbox } from "./checkbox.component";
import { CheckboxGroup } from "./checkbox-group.component";

/**
 * Importing this module (or the standalone components) registers the
 * `cds-checkbox` and `cds-checkbox-group` web components.
 */
@NgModule({
	imports: [Checkbox, CheckboxGroup],
	exports: [Checkbox, CheckboxGroup]
})
export class CheckboxModule {}
