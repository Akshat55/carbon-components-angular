import { moduleMetadata, Meta } from "@storybook/angular";
import {
	ContextMenuComponent,
	ContextMenuDividerComponent,
	ContextMenuItemComponent,
	ContextMenuGroupComponent
} from "./";

export default {
	title: "Components/Context Menu",
	decorators: [
		moduleMetadata({
			imports: [
				ContextMenuComponent,
				ContextMenuDividerComponent,
				ContextMenuItemComponent,
				ContextMenuGroupComponent
			]
		})
	],
	args: {
		position: {
			top: 0,
			left: 0
		},
		open: true,
		checkboxGroupValue: ["a", "b"],
		radioGroupValue: "one"
	},
	argTypes: {
		onRadioChange: { action: "Radio menu change!" },
		onCheckboxChange: { action: "Radio menu change!" }
	},
	component: ContextMenuComponent,
	subcomponents: {
		ContextMenuDividerComponent,
		ContextMenuItemComponent,
		ContextMenuGroupComponent
	},
	parameters: {
		docs: {
			story: {
				height: "25rem"
			}
		}
	}
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<cds-menu [open]="open" [position]="position" [size]="size">
			<cds-menu-item label="Cut" info="⌘X"></cds-menu-item>
			<cds-menu-item label="Option with icon" icon="calendar"></cds-menu-item>
			<cds-menu-item-divider></cds-menu-item-divider>
			<cds-menu-item type="checkbox" label="Enable magic"></cds-menu-item>
			<cds-menu-item-divider></cds-menu-item-divider>
			<cds-menu-item-group label="Selection group" type="checkbox">
				<cds-menu-item type="checkbox" label="Blue"></cds-menu-item>
				<cds-menu-item type="checkbox" label="Red" [checked]="true"></cds-menu-item>
				<cds-menu-item type="checkbox" label="Black"></cds-menu-item>
				<cds-menu-item type="checkbox" label="Green"></cds-menu-item>
			</cds-menu-item-group>
			<cds-menu-item-divider></cds-menu-item-divider>
			<cds-menu-item label="Radio flyout">
				<cds-menu>
					<cds-menu-item-group
						type="radio"
						[value]="radioGroupValue"
						(valueChange)="onRadioChange($event)">
						<cds-menu-item type="radio" label="Radio one" value="one"></cds-menu-item>
						<cds-menu-item type="radio" label="Radio two" value="two"></cds-menu-item>
						<cds-menu-item type="radio" label="Radio three" value="three"></cds-menu-item>
						<cds-menu-item type="radio" label="Radio four" value="four"></cds-menu-item>
					</cds-menu-item-group>
				</cds-menu>
			</cds-menu-item>
			<cds-menu-item label="Checkbox flyout">
				<cds-menu>
					<cds-menu-item-group
						type="checkbox"
						[value]="checkboxGroupValue"
						(valueChange)="onCheckboxChange($event)">
						<cds-menu-item type="checkbox" label="Selectable item a" value="a"></cds-menu-item>
						<cds-menu-item type="checkbox" label="Selectable item b" value="b"></cds-menu-item>
						<cds-menu-item type="checkbox" label="Selectable item c" value="c"></cds-menu-item>
						<cds-menu-item type="checkbox" label="Selectable item d" value="d"></cds-menu-item>
					</cds-menu-item-group>
				</cds-menu>
			</cds-menu-item>
			<cds-menu-item-divider></cds-menu-item-divider>
			<cds-menu-item
				label="Delete"
				[danger]="true"
				dangerDescription="Permanently removes the selection">
			</cds-menu-item>
		</cds-menu>
	`
});
export const Basic = Template.bind({});
