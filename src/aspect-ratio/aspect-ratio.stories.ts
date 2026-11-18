

import { moduleMetadata, Meta, componentWrapperDecorator } from "@storybook/angular";
import { AspectRatioModule, AspectRatioDirective } from "./";
import { GridModule } from "../grid";

export default {
	title: "Components/AspectRatio",
	decorators: [
		moduleMetadata({
			imports: [AspectRatioModule, GridModule]
		}),
		componentWrapperDecorator((story) => `<div class="aspect-ratio-story">${story}</div>`)
	],
	component: AspectRatioDirective,
	argTypes: {
		ratio: {
			control: "select",
			options: ["16x9", "9x16", "2x1", "1x2", "4x3", "3x4", "1x1"]
		},
		aspectRatioBase: {
			control: false
		}
	}
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<div>
			<cds-grid>
				<cds-column sm="1" md="2" lg="4">
					<div cdsAspectRatio [ratio]="ratio">Content</div>
				</cds-column>
				<cds-column sm="1" md="2" lg="4">
					<div cdsAspectRatio [ratio]="ratio">Content</div>
				</cds-column>
				<cds-column sm="1" md="2" lg="4">
					<div cdsAspectRatio [ratio]="ratio">Content</div>
				</cds-column>
				<cds-column sm="1" md="2" lg="4">
					<div cdsAspectRatio [ratio]="ratio">Content</div>
				</cds-column>
			</cds-grid>
		</div>
	`
});
export const Default = Template.bind({});
