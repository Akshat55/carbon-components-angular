import { moduleMetadata, Meta } from "@storybook/angular";
import { FormsModule } from "@angular/forms";
import { CdsPasswordInput, PasswordInputSkeleton } from "./";

export default {
	title: "Components/Input/Password",
	decorators: [
		moduleMetadata({
			imports: [FormsModule, CdsPasswordInput, PasswordInputSkeleton]
		})
	],
	args: {
		disabled: false,
		invalid: false,
		invalidText: "Invalid entry",
		warn: false,
		warnText: "This is a warning!",
		label: "Text input label",
		helperText: "Optional helper text",
		placeholder: "Placeholder",
		size: "md",
		readonly: false,
		fluid: false,
		inline: false,
		showPasswordLabel: "Show password",
		hidePasswordLabel: "Hide password"
	},
	argTypes: {
		size: {
			options: ["sm", "md", "lg"],
			control: "select"
		}
	},
	component: CdsPasswordInput
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-password-input
			[label]="label"
			[helperText]="helperText"
			[placeholder]="placeholder"
			[size]="size"
			[disabled]="disabled"
			[readonly]="readonly"
			[invalid]="invalid"
			[invalidText]="invalidText"
			[warn]="warn"
			[warnText]="warnText"
			[fluid]="fluid"
			[inline]="inline"
			[showPasswordLabel]="showPasswordLabel"
			[hidePasswordLabel]="hidePasswordLabel"
			[(ngModel)]="value" />
	`
});
export const Basic = Template.bind({});

export const Fluid = Template.bind({});
Fluid.args = {
	fluid: true
};

const SkeletonTemplate = () => ({
	template: `<cds-password-input-skeleton />`
});
export const Skeleton = SkeletonTemplate.bind({});
