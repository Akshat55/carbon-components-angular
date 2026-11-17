import { moduleMetadata, Meta } from "@storybook/angular";
import {
	ContextMenuComponent,
	ContextMenuDividerComponent,
	ContextMenuItemComponent,
	ContextMenuGroupComponent,
	MenuItemRadioGroup,
	MenuItemSelectable
} from "./";

export default {
	title: "Components/Context Menu",
	decorators: [
		moduleMetadata({
			imports: [
				ContextMenuComponent,
				ContextMenuDividerComponent,
				ContextMenuItemComponent,
				ContextMenuGroupComponent,
				MenuItemRadioGroup,
				MenuItemSelectable
			]
		})
	],
	args: {
		position: {
			top: 0,
			left: 0
		},
		open: true,
		radioGroupValue: "Radio one"
	},
	argTypes: {
		onRadioChange: { action: "Radio menu change!" },
		onCheckboxChange: { action: "Checkbox menu change!" }
	},
	component: ContextMenuComponent,
	subcomponents: {
		ContextMenuDividerComponent,
		ContextMenuItemComponent,
		ContextMenuGroupComponent,
		MenuItemRadioGroup,
		MenuItemSelectable
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
			<cds-menu-item-selectable label="Enable magic"></cds-menu-item-selectable>
			<cds-menu-item-divider></cds-menu-item-divider>
			<cds-menu-item-group label="Selection group">
				<cds-menu-item-selectable label="Blue"></cds-menu-item-selectable>
				<cds-menu-item-selectable label="Red" [selected]="true"></cds-menu-item-selectable>
				<cds-menu-item-selectable label="Black"></cds-menu-item-selectable>
				<cds-menu-item-selectable label="Green"></cds-menu-item-selectable>
			</cds-menu-item-group>
			<cds-menu-item-divider></cds-menu-item-divider>
			<cds-menu-item label="Radio flyout">
				<cds-menu slot="submenu">
					<cds-menu-item-radio-group
						label="Radio group"
						[selected]="radioGroupValue"
						(selectedChange)="onRadioChange($event)">
						<cds-menu-item label="Radio one"></cds-menu-item>
						<cds-menu-item label="Radio two"></cds-menu-item>
						<cds-menu-item label="Radio three"></cds-menu-item>
						<cds-menu-item label="Radio four"></cds-menu-item>
					</cds-menu-item-radio-group>
				</cds-menu>
			</cds-menu-item>
			<cds-menu-item label="Checkbox flyout">
				<cds-menu slot="submenu">
					<cds-menu-item-selectable label="Selectable item a" [selected]="true" (selectedChange)="onCheckboxChange($event)"></cds-menu-item-selectable>
					<cds-menu-item-selectable label="Selectable item b" (selectedChange)="onCheckboxChange($event)"></cds-menu-item-selectable>
					<cds-menu-item-selectable label="Selectable item c" (selectedChange)="onCheckboxChange($event)"></cds-menu-item-selectable>
				</cds-menu>
			</cds-menu-item>
			<cds-menu-item-divider></cds-menu-item-divider>
			<cds-menu-item
				label="Delete"
				kind="danger"
				dangerDescription="Permanently removes the selection">
			</cds-menu-item>
		</cds-menu>
	`
});
export const Basic = Template.bind({});
