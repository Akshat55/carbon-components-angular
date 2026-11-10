/**
 * Storybook stories for the Angular tabs directive layer.
 * The directives map onto the <cds-tabs> / <cds-tab> web components.
 * Tab panels live outside the tabs element and are linked via `target`.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { TabsModule } from "./index";

export default {
	title: "Components/Tabs",
	decorators: [
		moduleMetadata({
			imports: [TabsModule]
		})
	],
	argTypes: {
		type: { control: "radio", options: ["line", "contained"] },
		selected: { action: "selected" }
	},
	args: {
		type: "line"
	}
} as Meta;

export const Basic = (args) => ({
	props: args,
	template: `
		<cds-tabs value="one" [type]="type" (selected)="selected($event)">
			<cds-tab id="tab-one" value="one" target="panel-one">Tab one</cds-tab>
			<cds-tab id="tab-two" value="two" target="panel-two">Tab two</cds-tab>
			<cds-tab id="tab-three" value="three" target="panel-three" [disabled]="true">Tab three</cds-tab>
		</cds-tabs>
		<div style="padding: 1rem 0">
			<div id="panel-one" role="tabpanel" aria-labelledby="tab-one">Content for tab one.</div>
			<div id="panel-two" role="tabpanel" aria-labelledby="tab-two" hidden>Content for tab two.</div>
			<div id="panel-three" role="tabpanel" aria-labelledby="tab-three" hidden>Content for tab three.</div>
		</div>
	`
});

export const Skeleton = () => ({
	template: `<cds-tabs-skeleton></cds-tabs-skeleton>`
});
Skeleton.parameters = { controls: { disable: true } };
