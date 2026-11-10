/**
 * Storybook stories for the Angular ui-shell directive layer.
 * The directives map the old API onto the ui-shell web components.
 */
import { Meta, moduleMetadata } from "@storybook/angular";
import { UIShellModule } from "./index";

export default {
	title: "Components/UI Shell",
	decorators: [
		moduleMetadata({
			imports: [UIShellModule]
		})
	]
} as Meta;

export const Header = () => ({
	template: `
		<cds-header brand="IBM" name="[Platform]" href="#">
			<cds-header-nav ariaLabel="Platform navigation">
				<cds-header-nav-item href="#">Link 1</cds-header-nav-item>
				<cds-header-nav-item href="#">Link 2</cds-header-nav-item>
				<cds-header-menu title="Menu">
					<cds-header-menu-item href="#">Sub-link 1</cds-header-menu-item>
					<cds-header-menu-item href="#">Sub-link 2</cds-header-menu-item>
				</cds-header-menu>
			</cds-header-nav>
		</cds-header>
	`
});

export const HeaderWithSideNav = () => ({
	props: { expanded: true },
	template: `
		<cds-header brand="IBM" name="[Platform]" href="#">
			<cds-header-menu-button [active]="expanded" (selected)="expanded = !expanded"></cds-header-menu-button>
		</cds-header>
		<cds-side-nav [expanded]="expanded" aria-label="Side navigation">
			<cds-side-nav-items>
				<cds-side-nav-link href="#" [active]="true">Link 1</cds-side-nav-link>
				<cds-side-nav-link href="#">Link 2</cds-side-nav-link>
				<cds-side-nav-menu title="Category">
					<cds-side-nav-menu-item href="#">Sub-link 1</cds-side-nav-menu-item>
					<cds-side-nav-menu-item href="#">Sub-link 2</cds-side-nav-menu-item>
				</cds-side-nav-menu>
			</cds-side-nav-items>
		</cds-side-nav>
	`
});
HeaderWithSideNav.storyName = "Header with Side Nav";
