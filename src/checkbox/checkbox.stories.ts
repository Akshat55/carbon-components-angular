/**
 * Storybook stories for the Angular checkbox directive layer.
 * The directive maps the old @Input/@Output API onto the <cds-checkbox>
 * web component and supports ngModel / reactive forms via ControlValueAccessor.
 */
import { FormsModule } from "@angular/forms";
import { Meta, moduleMetadata } from "@storybook/angular";
import { CheckboxModule } from "./index";

export default {
	title: "Components/Checkbox",
	decorators: [
		moduleMetadata({
			imports: [CheckboxModule, FormsModule]
		})
	],
	argTypes: {
		checked: { control: "boolean" },
		disabled: { control: "boolean" },
		hideLabel: { control: "boolean" },
		indeterminate: { control: "boolean" },
		invalid: { control: "boolean" },
		warn: { control: "boolean" },
		helperText: { control: "text" },
		invalidText: { control: "text" },
		warnText: { control: "text" },
		checkedChange: { action: "checkedChange" }
	},
	args: {
		checked: false,
		disabled: false,
		hideLabel: false,
		indeterminate: false,
		invalid: false,
		warn: false,
		helperText: "Helper text",
		invalidText: "Invalid text",
		warnText: "Warning text"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-checkbox-group legend="Checkbox group label">
			<cds-checkbox
				[checked]="checked"
				[disabled]="disabled"
				[hideLabel]="hideLabel"
				[indeterminate]="indeterminate"
				[invalid]="invalid"
				[invalidText]="invalidText"
				[warn]="warn"
				[warnText]="warnText"
				[helperText]="helperText"
				(checkedChange)="checkedChange($event)">
				Checkbox label
			</cds-checkbox>
			<cds-checkbox (checkedChange)="checkedChange($event)">
				Another checkbox
			</cds-checkbox>
		</cds-checkbox-group>
	`
});

export const WithNgModel = (args) => ({
	props: { ...args, model: true },
	template: `
		<cds-checkbox [(ngModel)]="model">Bound with ngModel: {{ model }}</cds-checkbox>
	`
});
WithNgModel.storyName = "With ngModel";

export const Skeleton = () => ({
	template: `<cds-checkbox-skeleton></cds-checkbox-skeleton>`
});
Skeleton.parameters = { controls: { disable: true } };
