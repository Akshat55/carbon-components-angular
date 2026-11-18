import { moduleMetadata, Meta } from "@storybook/angular";
import { CdsLayer } from "./";

export default {
	title: "Components/Layer",
	decorators: [
		moduleMetadata({
			imports: [CdsLayer]
		})
	],
	parameters: {
		controls: {
			disable: true
		}
	},
	component: CdsLayer
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<div class="example-layer">Layer 0</div>
		<cds-layer>
			<div class="example-layer">Layer 1</div>
			<cds-layer>
				<div class="example-layer">Layer 2</div>
			</cds-layer>
		</cds-layer>
	`,
	styles: [
		`.example-layer {
			padding: 1rem;
			background: var(--cds-layer);
			color: theme.$text-primary;
		}`
	]
});
export const Basic = Template.bind({});

const TemplateWithInput = (args) => ({
	props: args,
	template: `
		<div class="example-layer">Layer 0</div>
		<cds-layer>
			<div class="example-layer">Layer 1</div>
			<cds-layer>
				<div class="example-layer">Layer 2</div>
				<!-- Reset layer, child layer will auto increment or you can pass in layer of your choice -->
				<cds-layer [level]="0">
					<div class="example-layer">Layer 0</div>
					<cds-layer [level]="1">
						<div class="example-layer">Layer 1</div>
						<cds-layer>
							<div class="example-layer">Layer 2</div>
						</cds-layer>
					</cds-layer>
				</cds-layer>
			</cds-layer>
		</cds-layer>
	`,
	styles: [
		`.example-layer {
			padding: 1rem;
			background: var(--cds-layer);
			color: theme.$text-primary;
		}`
	]
});
export const CustomOrder = TemplateWithInput.bind({});
