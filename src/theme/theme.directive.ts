import { Directive, HostBinding, Input } from "@angular/core";

export type ThemeType = "white" | "g10" | "g90" | "g100";

/**
 * Applies theme styles to the div container it is applied to. There is no theme web component;
 * `cds-layer`s inside start again from the first layer level. Get started with importing the directive:
 *
 * ```typescript
 * import { ThemeDirective } from 'carbon-components-angular';
 * ```
 *
 * [See demo](../../?path=/story/components-theme--basic)
 */
@Directive({
	selector: "[cdsTheme], [ibmTheme]",
	exportAs: "theme",
	standalone: true
})
export class ThemeDirective {
	/**
	 * @deprecated as of v5 - Use `cdsTheme` input property instead
	 */
	@Input() set ibmTheme(type: ThemeType | "") {
		this.cdsTheme = type;
	}

	/**
	 * Sets the theme for the content
	 * Accepts `ThemeType` or nothing (empty string which is equivalent to "white")
	 * Empty string has been added as an option for Angular 16+ to resolve type errors
	 */
	@Input() cdsTheme: ThemeType | "" = "white";

	/**
	 * Using host bindings with classes to ensure we do not
	 * overwrite user added classes
	 */
	@HostBinding("class.cds--white") get whiteThemeClass() {
		return this.cdsTheme === "white" || !this.cdsTheme;
	}

	@HostBinding("class.cds--g10") get g10ThemeClass() {
		return this.cdsTheme === "g10";
	}

	@HostBinding("class.cds--g90") get g90ThemeClass() {
		return this.cdsTheme === "g90";
	}

	@HostBinding("class.cds--g100") get g100ThemeClass() {
		return this.cdsTheme === "g100";
	}

	@HostBinding("class.cds--layer-one") layerClass = true;
}
