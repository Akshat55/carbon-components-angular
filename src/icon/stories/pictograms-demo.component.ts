import { Component, inject, OnInit } from "@angular/core";
import * as Icons from "@carbon/pictograms";

import { IconDirective } from "../icon.directive";
import { IconService } from "..";
import { CdsColumn, CdsGrid } from "../../grid";

@Component({
	selector: "app-demo-many-pictograms",
	imports: [IconDirective, CdsGrid, CdsColumn],
	template: `
		<div>
			<cds-grid>
				@for (icon of groupedIcons; track icon) {
					<cds-column lg="4" md="4" sm="2" class="pictogram">
						<svg [cdsIcon]="icon.name" size="64"></svg>
						<div>name: <code>{{icon.name}}</code></div>
						<div>size: <code>64</code></div>
					</cds-column>
				}
			</cds-grid>
		</div>
	`,
	styles: [
		`
			.pictogram {
				padding: 1rem 0;
			}
		`
	]
})
export class ManyPictogramsDemo implements OnInit {
	groupedIcons: any = [];

	protected iconService = inject(IconService);

	ngOnInit() {
		const iconMap = new Map();
		for (const descriptor of Object.values(Icons)) {
			this.iconService.register(descriptor as any);
			if (typeof descriptor === "object" && descriptor) {
				if (!iconMap.has(descriptor["name"])) {
					iconMap.set(descriptor["name"], descriptor);
				}
			}
		}
		// Render after a delay to prevent page from freezing
		setTimeout(() => {
			this.groupedIcons = Array.from(iconMap.values());
		}, 1000);
	}
}
