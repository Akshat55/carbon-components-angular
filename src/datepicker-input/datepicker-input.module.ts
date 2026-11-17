import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatePickerInput } from "./datepicker-input.component";
import { IconDirective } from "carbon-components-angular/icon";
import { DatePickerInputSkeleton } from "./datepicker-input-skeleton.component";

@NgModule({
	exports: [
		DatePickerInput,
		DatePickerInputSkeleton
	],
	imports: [
		CommonModule,
		IconDirective,
		DatePickerInput,
		DatePickerInputSkeleton
	]
})
export class DatePickerInputModule {}
