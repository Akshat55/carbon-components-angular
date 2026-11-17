import {
	ChangeDetectionStrategy,
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	Input,
	inject,
	ElementRef
} from "@angular/core";
import "@carbon/web-components/es/components/icon/index.js";
import { IconService } from "./icon.service";

/**
 * Adds Angular inputs to the `<cds-icon>` web component. Importing it registers the web component.
 *
 * `icon` takes an icon from `@carbon/icons`, or the name of one registered with `IconService`
 * (like `cdsIcon`):
 *
 * ```html
 * <cds-icon [icon]="add16" />
 * <cds-icon icon="add" [size]="20" />
 * ```
 */
@Component({
	selector: "cds-icon",
	template: "",
	host: {
		"[icon]": "descriptor",
		"[size]": "size ?? element.size",
		"[ariaLabel]": "ariaLabel ?? element.ariaLabel"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CdsIcon {
	@Input() icon: object | string;
	/**
	 * The web component's default is 16.
	 */
	@Input() size?: 16 | 20 | 24 | 32;
	/**
	 * Without it, the icon is decorative and hidden from assistive technology.
	 */
	@Input() ariaLabel: string;

	protected iconService = inject(IconService);
	protected element = inject(ElementRef).nativeElement;

	/**
	 * The `@carbon/icons` descriptor the web component renders.
	 */
	get descriptor(): object | undefined {
		return typeof this.icon === "string" ? this.iconService.get(this.icon, String(this.size ?? this.element.size ?? 16)) : this.icon;
	}
}
