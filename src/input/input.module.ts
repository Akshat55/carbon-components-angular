// modules
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

// imports
import { Label } from "./label.component";
import { TextInput } from "./input.directive";
import { TextArea } from "./text-area.directive";
import { TextareaLabelComponent } from "./textarea-label.component";
import { TextInputLabelComponent } from "./text-input-label.component";
import { IconDirective } from "carbon-components-angular/icon";
import { PasswordInput } from "./password.directive";
import { PasswordInputLabelComponent } from "./password-input-label.component";
import { CdsPasswordInput, CdsTextarea, CdsTextInput } from "./text-input.component";



@NgModule({
	exports: [
		Label,
		TextInputLabelComponent,
		TextInput,
		TextareaLabelComponent,
		TextArea,
		PasswordInputLabelComponent,
		PasswordInput,
		CdsTextInput,
		CdsTextarea,
		CdsPasswordInput
	],
	imports: [
		CommonModule,
		FormsModule,
		IconDirective,
		Label,
		TextInput,
		TextArea,
		PasswordInput,
		TextareaLabelComponent,
		TextInputLabelComponent,
		PasswordInputLabelComponent,
		CdsTextInput,
		CdsTextarea,
		CdsPasswordInput
	]
})
export class InputModule {}
