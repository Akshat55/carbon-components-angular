import { NgModule } from "@angular/core";
import { CdsPasswordInput, CdsTextarea, CdsTextInput } from "./text-input.component";
import { TextInputSkeleton, TextareaSkeleton, PasswordInputSkeleton } from "./input-skeleton.component";

const COMPONENTS = [
	CdsTextInput,
	CdsTextarea,
	CdsPasswordInput,
	TextInputSkeleton,
	TextareaSkeleton,
	PasswordInputSkeleton
];

/**
 * The text input web components. Importing it registers `cds-text-input`, `cds-textarea` and `cds-password-input`.
 */
@NgModule({
	imports: COMPONENTS,
	exports: COMPONENTS
})
export class InputModule {}
