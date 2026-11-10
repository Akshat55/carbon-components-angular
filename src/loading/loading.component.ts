import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	inject
} from "@angular/core";
import "@carbon/web-components/es/components/loading/index.js";
import { I18n } from "carbon-components-angular/i18n";

/**
 * Wraps the `<cds-loading>` web component.
 *
 * [See demo](../../?path=/story/components-loading--basic)
 */
@Component({
	selector: "cds-loading",
	template: "",
	host: {
		"[description]": "title",
		"[active]": "isActive",
		"[small]": "size === 'sm'",
		"[overlay]": "overlay"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Loading {
	public i18n = inject(I18n);

	/**
	 * Accessible description. Defaults to the `LOADING.TITLE` i18n value.
	 */
	@Input() title = this.i18n.get().LOADING.TITLE;
	/**
	 * Set to `false` to stop the animation.
	 */
	@Input() isActive = true;
	@Input() size: "normal" | "sm" = "normal";
	/**
	 * Shows the loading indicator over the whole page.
	 */
	@Input() overlay = false;
}
