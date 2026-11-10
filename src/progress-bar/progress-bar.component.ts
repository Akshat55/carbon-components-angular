import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	TemplateRef
} from "@angular/core";
import "@carbon/web-components/es/components/progress-bar/index.js";
import { TemplateContent } from "carbon-components-angular/utils";

/**
 * Wraps the `<cds-progress-bar>` web component. Leave `value` undefined for an indeterminate bar.
 *
 * [See demo](../../?path=/story/components-progress-bar--basic)
 */
@Component({
	selector: "cds-progress-bar",
	template: "",
	host: {
		"[id]": "id",
		"[value]": "value",
		"[max]": "max",
		"[label]": "content.render('label', label)",
		"[helperText]": "content.render('helperText', helperText)",
		"[type]": "type",
		"[status]": "status",
		"[size]": "size",
		"[hideLabel]": "hideLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProgressBar {
	static progressBarCounter = 0;

	@Input() id = `progress-bar-${ProgressBar.progressBarCounter++}`;
	/**
	 * Current value, from 0 to `max`.
	 */
	@Input() value: number | undefined;
	@Input() max = 100;
	@Input() label: string | TemplateRef<any>;
	@Input() helperText: string | TemplateRef<any>;
	@Input() type: "default" | "inline" | "indented" = "default";
	@Input() status: "active" | "finished" | "error" = "active";
	@Input() size: "small" | "big" = "big";
	@Input() hideLabel = false;

	protected content = new TemplateContent();
}
