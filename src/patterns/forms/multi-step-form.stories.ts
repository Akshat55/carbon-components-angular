import {
	Component,
	inject,
	OnDestroy,
	OnInit
} from "@angular/core";
import { moduleMetadata, Meta } from "@storybook/angular";
import { CdsColumn, CdsGrid } from "../../grid";
import { Dropdown, DropdownList } from "../../dropdown";
import { CdsButton } from "../../button";
import { ProgressIndicator } from "../../progress-indicator";
import { Breadcrumb, BreadcrumbItemComponent } from "../../breadcrumb";
import {
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule
} from "@angular/forms";
import { Checkbox } from "../../checkbox";
import { Hamburger, Header } from "../../ui-shell";
import { CdsTextInput, CdsTextarea } from "../../input";

@Component({
	selector: "app-multi-step-form",
	template: `
		<div>
			<div class="header">
				<cds-header name="Patterns">
					<cds-header-menu-button></cds-header-menu-button>
				</cds-header>
			</div>
			<cds-grid>
				<cds-column lg="8" md="8" sm="8">
					<cds-breadcrumb [noTrailingSlash]="noTrailingSlash">
						<cds-breadcrumb-item href="#1">
							Dashboard
						</cds-breadcrumb-item>
					</cds-breadcrumb>
				</cds-column>
			</cds-grid>
			<cds-grid class="sub-heading">
				<cds-column lg="8" md="8" sm="8">
					<h4>Vertical multi-step form</h4>
				</cds-column>
			</cds-grid>
			<cds-grid>
				<cds-column lg="2" md="2" sm="2"
					class="indicator-wrapper">
					<div class="indicator">
						<cds-progress-indicator
							orientation="vertical"
							[steps]="steps"
							[current]="currentStep">
						</cds-progress-indicator>
					</div>
				</cds-column>
				<cds-column lg="6" md="6" sm="6">
					@switch (currentStep) {
						@case (1) {
							<form [formGroup]="step2FormGroup">
								<div>
									<div>
										<h4>Create a new workspace</h4>
										<label class="form-label">
											When you create a workspace, you connect IBM Cloud
											Schematics to existing Github / Gitlab repos that host
											your Terraform templates.
										</label>
									</div>
									<div class="form-item">
										<cds-text-input label="Workspace name" autocomplete="off" formControlName="workspaceName" />
									</div>
									<div class="form-item">
										<cds-dropdown
											class="dropdown"
											label="Resource group"
											value="content"
											formControlName="resourceGroup"
											[dropUp]="false">
											<cds-dropdown-list [items]="resourceGroups"></cds-dropdown-list>
										</cds-dropdown>
									</div>
									<div class="form-item">
										<cds-textarea label="Description (optional)" placeholder="What is the purpose of this workspace?" formControlName="purpose" [rows]="3" />
									</div>
									<div class="form-item">
										<cds-button (click)="changeStep(2)">Step 3</cds-button>
									</div>
								</div>
							</form>
						}
						@case (2) {
							<div>
								<cds-grid>
									Step 3 form!
								</cds-grid>
								<div class="form-item">
									<cds-button (click)="changeStep(1)">Step 2</cds-button>
								</div>
							</div>
						}
					}
				</cds-column>
			</cds-grid>
		</div>
	`,
	styles: [`
		.header {
			margin-bottom: 5rem;
		}

		.indicator-wrapper {
			background-color: #f4f4f4;
		}

		.sub-heading {
			margin-bottom: 1.5rem;
		}

		.indicator {
			margin-top: 1rem;
		}

		.form-label {
			margin-top: 0.7rem;
			margin-bottom: 0.5rem;
		}

		.dropdown {
			width: 100%;
		}

		.form-item {
			margin-top: 1.5rem;
		}
	`],
	imports: [
		CdsGrid,
		CdsColumn,
		Checkbox,
		ProgressIndicator,
		CdsButton,
		Breadcrumb,
		BreadcrumbItemComponent,
		ReactiveFormsModule,
		Dropdown,
		DropdownList,
		Header,
		Hamburger,
		CdsTextInput,
		CdsTextarea
	],
	standalone: true
})
class MultiStepFormStory implements OnInit, OnDestroy {
	public step2FormGroup: FormGroup;

	steps = [
		{
			label: "Step 1",
			complete: true
		},
		{
			label: "Step 2",
			current: true,
			complete: false
		},
		{
			label: "Step 3",
			complete: false,
			invalid: true
		},
		{
			label: "Step 4",
			complete: false,
			secondaryLabel: "Optional"
		}
	];

	resourceGroups = [
		{ content: "None" },
		{ content: "Resource group 1" },
		{ content: "Resource group 2" }
	];

	currentStep = 1;

	protected formBuilder = inject(FormBuilder);

	ngOnInit() {
		document.querySelector(".sb-show-main")?.classList.add("full-page");

		this.step2FormGroup = this.formBuilder.group({
			workspaceName: new FormControl(),
			resourceGroup: new FormControl(),
			purpose: new FormControl()
		});

		this.step2FormGroup.get("resourceGroup")?.setValue("None");
	}

	ngOnDestroy() {
		document.querySelector(".sb-show-main")?.classList.remove("full-page");
	}

	changeStep(step: number) {
		this.currentStep = step;
	}
}

// Storybook starts here
export default {
	title: "Pattern/Forms",
	decorators: [
		moduleMetadata({
			declarations: [  ],
			imports: [
				MultiStepFormStory
			]
		})
	]
} as Meta;

const Template = (args) => ({
	props: args,
	template: `
		<!--
			app-* components are for demo purposes only.
			You can create your own implementation by using the component source as an example.
		-->
		<app-multi-step-form></app-multi-step-form>
	`
});
export const MultiStep = Template.bind({});
