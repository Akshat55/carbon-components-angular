import { importProvidersFrom } from "@angular/core";
import { RouterModule } from "@angular/router";
import { moduleMetadata, Meta, applicationConfig } from "@storybook/angular";
import { Search } from "../search";
import { IconDirective } from "../icon";
import { ThemeDirective } from "../theme";

import { BarComponent, FooComponent, HeaderFluidComponent } from "./stories";
import {
	Header,
	Hamburger,
	HeaderAction,
	HeaderItem,
	HeaderNavigation,
	HeaderMenu,
	HeaderGlobal
} from "./header";
import { SideNav, SideNavItem, SideNavMenu } from "./sidenav";
import { CommonModule } from "@angular/common";
import { Panel, SwitcherList, SwitcherListItem } from "./panel";

export default {
	title: "Components/UI Shell",
	decorators: [
		applicationConfig({
			providers: [
				importProvidersFrom(RouterModule.forRoot([
					{
						path: "bar",
						component: BarComponent
					},
					{
						path: "foo",
						component: FooComponent
					}
				], { useHash: true }))
			]
		}),
		moduleMetadata({
			imports: [
				ThemeDirective,
				IconDirective,
				Search,
				Hamburger,
				Header,
				HeaderAction,
				HeaderGlobal,
				HeaderItem,
				HeaderMenu,
				HeaderNavigation,
				Panel,
				SideNav,
				SideNavMenu,
				SideNavItem,
				SwitcherList,
				SwitcherListItem,
				RouterModule,
				BarComponent,
				FooComponent,
				HeaderFluidComponent
			]
		})
	],
	args: {
		theme: "white"
	},
	argTypes: {
		theme: {
			options: ["white", "g10", "g90", "g100"],
			control: "radio"
		}
	},
	parameters: {
		docs: {
			story: {
				height: "30rem"
			}
		}
	}
} as Meta;

const HeaderTemplate = (args) => ({
	props: args,
	template: `
		<div [cdsTheme]="theme">
			<cds-header name="[Platform]">
				@if (hasHamburger) {
					<cds-header-menu-button (click)="expanded($event)"></cds-header-menu-button>
				}
				<cds-header-nav>
					<cds-header-nav-item>Catalog</cds-header-nav-item>
					<cds-header-nav-item isCurrentPage="true">Docs</cds-header-nav-item>
					<cds-header-nav-item>Support</cds-header-nav-item>
					<cds-header-menu title="Manage">
						<cds-header-menu-item>Link 1</cds-header-menu-item>
						<cds-header-menu-item>Link 2</cds-header-menu-item>
						<cds-header-menu-item>Link 3</cds-header-menu-item>
					</cds-header-menu>
				</cds-header-nav>
				<cds-header-global>
					<cds-header-global-action description="action">
						<svg cdsIcon="fade" size="20"></svg>
					</cds-header-global-action>
					<cds-header-global-action description="action">
						<svg cdsIcon="fade" size="20"></svg>
					</cds-header-global-action>
				</cds-header-global>
			</cds-header>
		</div>
	`
});
export const HeaderStory = HeaderTemplate.bind({});
HeaderStory.storyName = "Header";
HeaderStory.args = {
	hasHamburger: true
};
HeaderStory.argTypes = {
	expanded: {
		action: "Menu clicked!"
	}
};

const HeaderFluidTemplate = (args) => ({
	props: args,
	template: `
		<!--
		app-* components are for demo purposes only.
		You can create your own implementation by using the component source found at:
		https://github.com/IBM/carbon-components-angular/tree/master/src/ui-shell/stories/header-fluid.component.ts
		-->
		<app-header-fluid [headerItems]="headerItems"></app-header-fluid>
	`
});
export const HeaderFluid = HeaderFluidTemplate.bind({});
HeaderFluid.storyName = "Header fluid items to side navigation";
HeaderFluid.args = {
	headerItems: [
		{
			type: "item",
			content: "Catalog",
			title: "Catalog"
		},
		{
			type: "item",
			content: "Docs",
			isCurrentPage: true
		},
		{
			type: "item",
			content: "Support"
		},
		{
			type: "menu",
			title: "Manage",
			menuItems: [
				{
					type: "item",
					content: "Link 1"
				},
				{
					type: "item",
					content: "Link 2"
				},
				{
					type: "item",
					content: "Link 3"
				}
			]
		}
	]
};
HeaderFluid.argTypes = {
	headerItems: {
		control: false
	},
	theme: {
		control: false
	}
};

const HeaderWithTemplate = (args) => ({
	props: args,
	template: `
		<div [cdsTheme]="theme">
			<cds-header name="[Platform]" [brand]="brandTemplate">
				@if (hasHamburger) {
					<cds-header-menu-button (click)="expanded($event)"></cds-header-menu-button>
				}
				<cds-header-nav>
					<cds-header-nav-item>Catalog</cds-header-nav-item>
					<cds-header-nav-item>Docs</cds-header-nav-item>
					<cds-header-nav-item>Support</cds-header-nav-item>
					<cds-header-menu title="Manage">
						<cds-header-menu-item>Link 1</cds-header-menu-item>
						<cds-header-menu-item>Link 2</cds-header-menu-item>
						<cds-header-menu-item>Link 3</cds-header-menu-item>
					</cds-header-menu>
				</cds-header-nav>
				<cds-header-global>
					<cds-header-global-action description="action">
						<svg cdsIcon="fade" size="20"></svg>
					</cds-header-global-action>
					<cds-header-global-action description="action">
						<svg cdsIcon="fade" size="20"></svg>
					</cds-header-global-action>
				</cds-header-global>
			</cds-header>
		</div>
		<ng-template #brandTemplate>
			<a class="cds--header__name">
				<svg cdsIcon="carbon" size="16"></svg>
				<span class="cds--header__name--prefix">IBM</span>
				[Platform]
			</a>
		</ng-template>
	`
});
export const HeaderWithTemp = HeaderWithTemplate.bind({});
HeaderWithTemp.storyName = "Header with template";
HeaderWithTemp.args = {
	hasHamburger: true
};
HeaderWithTemp.argTypes = {
	expanded: {
		action: "Menu clicked!"
	}
};

const HeaderRouterTemplate = (args) => ({
	props: args,
	template: `
		<div [cdsTheme]="theme">
			<cds-header name="[Platform]" [route]="['bar']">
				<cds-header-nav>
					<cds-header-nav-item [route]="['foo']">Catalog</cds-header-nav-item>
					<cds-header-nav-item [route]="['bar']">Docs</cds-header-nav-item>
					<cds-header-nav-item [route]="['foo']">Support</cds-header-nav-item>
					<cds-header-menu title="Manage">
						<cds-header-menu-item [route]="['foo']">Link 1</cds-header-menu-item>
						<cds-header-menu-item [route]="['bar']">Link 2</cds-header-menu-item>
						<cds-header-menu-item [route]="['foo']">Link 3</cds-header-menu-item>
					</cds-header-menu>
				</cds-header-nav>
			</cds-header>
		</div>
		<div style="margin-top: 2rem">
			<router-outlet></router-outlet>
		</div>
	`
});
export const HeaderWithRouter = HeaderRouterTemplate.bind({});
HeaderWithRouter.argTypes = {
	expanded: {
		action: "Menu clicked!"
	}
};

const SideNavigationTemplate = (args) => ({
	props: args,
	template: `
		<div [cdsTheme]="theme">
			<cds-side-nav><cds-side-nav-items>
				<cds-side-nav-link [active]="true">
					Link
				</cds-side-nav-link>
				<cds-side-nav-link>
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					Link
				</cds-side-nav-link>
				<cds-side-nav-menu title="Category title">
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					<cds-side-nav-menu-item>Link</cds-side-nav-menu-item>
					<cds-side-nav-menu-item>Link</cds-side-nav-menu-item>
					<cds-side-nav-menu-item>Link</cds-side-nav-menu-item>
				</cds-side-nav-menu>
			</cds-side-nav-items></cds-side-nav>
		</div>
	`
});
export const SideNavigation = SideNavigationTemplate.bind({});
SideNavigation.args = {
	options: [
		{
			content: "Option 1",
			value: 1
		},
		{
			content: "Option 2",
			value: 2
		},
		{
			content: "Option 3",
			value: 3
		}
	]
};
SideNavigation.argTypes = {
	options: {
		control: false
	}
};

const SideNavigationRouterTemplate = (args) => ({
	props: args,
	template: `
		<div [cdsTheme]="theme">
			<cds-side-nav><cds-side-nav-items>
				<cds-side-nav-link [route]="['foo']">
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					Link
				</cds-side-nav-link>
				<cds-side-nav-link [route]="['bar']">
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					Link
				</cds-side-nav-link>
				<cds-side-nav-menu title="Category title">
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					<cds-side-nav-menu-item [route]="['foo']">Link</cds-side-nav-menu-item>
					<cds-side-nav-menu-item [route]="['bar']">Link</cds-side-nav-menu-item>
					<cds-side-nav-menu-item [route]="['foo']">Link</cds-side-nav-menu-item>
				</cds-side-nav-menu>
			</cds-side-nav-items></cds-side-nav>
		</div>
		<div style="margin-left: 18rem">
			<router-outlet></router-outlet>
		</div>
	`
});
export const SideNavigationRouter = SideNavigationRouterTemplate.bind({});
SideNavigationRouter.storyName = "Side Navigation with router";


const SideNavigationUseRouterTemplate = (args) => ({
	props: args,
	template: `
		<div [cdsTheme]="theme">
			<cds-side-nav><cds-side-nav-items>
				<cds-side-nav-link [route]="['foo']" [useRouter]="true">
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					Link
				</cds-side-nav-link>
				<cds-side-nav-link [route]="['bar']" [useRouter]="true" [routeExtras]="routeExtras">
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					Link with query params
				</cds-side-nav-link>
				<cds-side-nav-menu title="Category title">
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					<cds-side-nav-menu-item [route]="['foo']" [useRouter]="true">Link</cds-side-nav-menu-item>
					<cds-side-nav-menu-item [route]="['bar']" [useRouter]="true">Link</cds-side-nav-menu-item>
					<cds-side-nav-menu-item [route]="['foo']" [useRouter]="true">Link</cds-side-nav-menu-item>
				</cds-side-nav-menu>
			</cds-side-nav-items></cds-side-nav>
		</div>
		<div style="margin-left: 256px">
			<router-outlet></router-outlet>
		</div>
	`
});
export const SideNavigationUseRouter = SideNavigationUseRouterTemplate.bind({});
SideNavigationUseRouter.storyName = "Side Navigation with useRouter";
SideNavigationUseRouter.args = {
	routeExtras: {
		queryParams: {
			key: "value"
		}
	}
};

const SidePanelTemplate = (args) => ({
	props: args,
	template: `
		<div [cdsTheme]="theme">
			<cds-header-panel expanded="true">
				<cds-switcher>
					<cds-switcher-item [route]="['foo']">Switcher item one</cds-switcher-item>
					<cds-switcher-item [route]="['bar']">Switcher item two</cds-switcher-item>
					<cds-switcher-item [route]="['foo']">Switcher item three</cds-switcher-item>
					<cds-switcher-item [route]="['bar']">Switcher item four</cds-switcher-item>
				</cds-switcher>
			</cds-header-panel>
		</div>
		<div>
			<router-outlet></router-outlet>
		</div>
	`
});
export const SidePanel = SidePanelTemplate.bind({});
SidePanel.storyName = "Side Panel with router";

const TogetherTemplate = (args) => ({
	props: args,
	template: `
		<div>
			<cds-header name="[Platform]">
				@if (hasHamburger) {
					<cds-header-menu-button [active]="active" (selected)="active = !active"></cds-header-menu-button>
				}
				<cds-header-nav>
					<cds-header-nav-item>Catalog</cds-header-nav-item>
					<cds-header-nav-item>Docs</cds-header-nav-item>
					<cds-header-nav-item>Support</cds-header-nav-item>
					<cds-header-menu title="Manage">
						<cds-header-menu-item>Link 1</cds-header-menu-item>
						<cds-header-menu-item>Link 2</cds-header-menu-item>
						<cds-header-menu-item>Link 3</cds-header-menu-item>
					</cds-header-menu>
				</cds-header-nav>
				<cds-header-global>
					<cds-header-global-action #firstAction description="action">
						<svg cdsIcon="fade" size="20"></svg>
					</cds-header-global-action>
					<cds-header-global-action [(active)]="secondAction" description="action">
						<svg cdsIcon="fade" size="20"></svg>
					</cds-header-global-action>
				</cds-header-global>
			</cds-header>
			<cds-side-nav [expanded]="active" style="margin-top: 3rem"><cds-side-nav-items>
				<cds-side-nav-link>
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					Link
				</cds-side-nav-link>
				<cds-side-nav-link>
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					Link
				</cds-side-nav-link>
				<cds-side-nav-menu title="Category title">
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					<cds-side-nav-menu-item>Link</cds-side-nav-menu-item>
					<cds-side-nav-menu-item [active]="hasActiveChild">Link</cds-side-nav-menu-item>
					<cds-side-nav-menu-item>Link</cds-side-nav-menu-item>
				</cds-side-nav-menu>
			</cds-side-nav-items></cds-side-nav>
			<cds-header-panel [expanded]="firstAction.active"></cds-header-panel>
			<cds-header-panel [expanded]="secondAction">
				<cds-switcher>
					<cds-switcher-item active="true">Switcher item one</cds-switcher-item>
					<cds-switcher-item>Switcher item two</cds-switcher-item>
					<cds-switcher-item>Switcher item three</cds-switcher-item>
					<cds-switcher-item>Switcher item four</cds-switcher-item>
				</cds-switcher>
			</cds-header-panel>
		</div>
	`
});
export const Together = TogetherTemplate.bind({});
Together.args = {
	hasHamburger: true,
	active: true,
	secondAction: false,
	hasActiveChild: true,
	options: [
		{
			content: "Option 1",
			value: 1
		},
		{
			content: "Option 2",
			value: 2
		},
		{
			content: "Option 3",
			value: 3
		}
	]
};
Together.argTypes = {
	options: {
		control: false
	}
};

const SideNavigationRailTemplate = (args) => ({
	props: args,
	template: `
		<div [cdsTheme]="theme">
			<cds-side-nav rail="true" [expanded]="false"><cds-side-nav-items>
				<cds-side-nav-link>
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					Link
				</cds-side-nav-link>
				<cds-side-nav-link>
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					Link
				</cds-side-nav-link>
				<cds-side-nav-menu title="Category title">
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					<cds-side-nav-menu-item>Link</cds-side-nav-menu-item>
					<cds-side-nav-menu-item>Link</cds-side-nav-menu-item>
					<cds-side-nav-menu-item>Link</cds-side-nav-menu-item>
				</cds-side-nav-menu>
			</cds-side-nav-items></cds-side-nav>
		</div>
	`
});
export const SideNavigationRail = SideNavigationRailTemplate.bind({});
SideNavigationRail.args = {
	options: [
		{
			content: "Option 1",
			value: 1
		},
		{
			content: "Option 2",
			value: 2
		},
		{
			content: "Option 3",
			value: 3
		}
	]
};
SideNavigationRail.argTypes = {
	options: {
		control: false
	}
};

const ModelTemplate = (args) => ({
	props: args,
	template: `
		<div [cdsTheme]="theme">
			<cds-header name="[Platform]">
				@if (hasHamburger) {
					<cds-header-menu-button [active]="active" (selected)="active = !active"></cds-header-menu-button>
				}
				<cds-header-nav [navigationItems]="headerItems">
				</cds-header-nav>
				<cds-header-global>
					<cds-header-global-action #firstAction description="action">
						<svg
							width="20"
							height="20"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 32 32"
							aria-hidden="true">
							<path
								d="M8.24 25.14L7 26.67a14 14 0 0 0 4.18 2.44l.68-1.88a12
								12 0 0 1-3.62-2.09zm-4.05-7.07l-2 .35A13.89 13.89 0 0 0 3.86
								23l1.73-1a11.9 11.9 0 0 1-1.4-3.93zm7.63-13.31l-.68-1.88A14
								14 0 0 0 7 5.33l1.24 1.53a12 12 0 0 1 3.58-2.1zM5.59
								10L3.86 9a13.89 13.89 0 0 0-1.64 4.54l2 .35A11.9 11.9 0 0 1 5.59
								10zM16 2v2a12 12 0 0 1 0 24v2a14 14 0 0 0 0-28z" />
						</svg>
					</cds-header-global-action>
					<cds-header-global-action #secondAction description="action">
						<svg
							width="20"
							height="20"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 32 32"
							aria-hidden="true">
							<path
								d="M8.24 25.14L7 26.67a14 14 0 0 0 4.18 2.44l.68-1.88a12
								12 0 0 1-3.62-2.09zm-4.05-7.07l-2 .35A13.89 13.89 0 0 0 3.86
								23l1.73-1a11.9 11.9 0 0 1-1.4-3.93zm7.63-13.31l-.68-1.88A14
								14 0 0 0 7 5.33l1.24 1.53a12 12 0 0 1 3.58-2.1zM5.59
								10L3.86 9a13.89 13.89 0 0 0-1.64 4.54l2 .35A11.9 11.9 0 0 1 5.59
								10zM16 2v2a12 12 0 0 1 0 24v2a14 14 0 0 0 0-28z" />
						</svg>
					</cds-header-global-action>
				</cds-header-global>
			</cds-header>
			<cds-side-nav [navigationItems]="headerItems" style="margin-top: 3rem"><cds-side-nav-items>
				<cds-side-nav-menu title="Category title">
					<svg slot="title-icon" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
						<path
							d="M8.24 25.14L7 26.67a14 14 0 0 0 4.18 2.44l.68-1.88a12
							12 0 0 1-3.62-2.09zm-4.05-7.07l-2 .35A13.89 13.89 0 0 0 3.86
							23l1.73-1a11.9 11.9 0 0 1-1.4-3.93zm7.63-13.31l-.68-1.88A14
							14 0 0 0 7 5.33l1.24 1.53a12 12 0 0 1 3.58-2.1zM5.59
							10L3.86 9a13.89 13.89 0 0 0-1.64 4.54l2 .35A11.9 11.9 0 0 1 5.59
							10zM16 2v2a12 12 0 0 1 0 24v2a14 14 0 0 0 0-28z" />
					</svg>
					<cds-side-nav-menu-item>Link</cds-side-nav-menu-item>
					<cds-side-nav-menu-item>Link</cds-side-nav-menu-item>
					<cds-side-nav-menu-item>Link</cds-side-nav-menu-item>
				</cds-side-nav-menu>
			</cds-side-nav-items></cds-side-nav>
			<cds-header-panel [expanded]="firstAction.active"></cds-header-panel>
			<cds-header-panel [expanded]="secondAction.active">
				<cds-switcher>
					<cds-switcher-item active="true">Switcher item one</cds-switcher-item>
					<cds-switcher-item>Switcher item two</cds-switcher-item>
					<cds-switcher-item>Switcher item three</cds-switcher-item>
					<cds-switcher-item>Switcher item four</cds-switcher-item>
				</cds-switcher>
			</cds-header-panel>
		</div>
		<router-outlet></router-outlet>
	`
});
export const WithModel = ModelTemplate.bind({});
WithModel.args = {
	options: [
		{
			content: "Option 1",
			value: 1
		},
		{
			content: "Option 2",
			value: 2
		},
		{
			content: "Option 3",
			value: 3
		}
	],
	headerItems: [{
		type: "item",
		route: ["foo"],
		content: "Catalog"
	},
	{
		type: "item",
		route: ["bar"],
		content: "Docs"
	},
	{
		type: "item",
		route: ["foo"],
		content: "Support"
	},
	{
		type: "menu",
		title: "Manage",
		trigger: "click",
		menuItems: [
			{
				type: "item",
				route: ["foo"],
				content: "Link 1"
			},
			{
				type: "item",
				route: ["bar"],
				content: "Link 2"
			}
		]
	}]
};
WithModel.argTypes = {
	options: {
		control: false
	},
	headerItems: {
		control: false
	}
};

const AngularRoutingTemplate = (args) => ({
	props: args,
	template: `
		<div [cdsTheme]="theme">
			<cds-side-nav rail="true" [expanded]="false"><cds-side-nav-items>
				<cds-side-nav-link>
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					Link
				</cds-side-nav-link>
				<cds-side-nav-link>
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					Link
				</cds-side-nav-link>
				<cds-side-nav-menu title="Category title">
					<svg slot="title-icon" cdsIcon="fade" size="16"></svg>
					<cds-side-nav-menu-item>Link</cds-side-nav-menu-item>
					<cds-side-nav-menu-item>Link</cds-side-nav-menu-item>
					<cds-side-nav-menu-item>Link</cds-side-nav-menu-item>
				</cds-side-nav-menu>
			</cds-side-nav-items></cds-side-nav>
		<div>
	`
});
export const AngularRouting = AngularRoutingTemplate.bind({});
AngularRouting.storyName = "Use angular router attributes for routing";
