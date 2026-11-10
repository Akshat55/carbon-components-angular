/**
 * Used to emit changes performed on a radio button.
 * The `source` is now the `CdsRadioDirective` attached to the
 * <cds-radio-button> web component (previously the `Radio` component).
 */
export class RadioChange {
	/**
	 * Contains the radio directive that has been changed.
	 */
	source: any | null;
	/**
	 * The value of the radio encompassed in the `RadioChange` class.
	 */
	value: string;

	constructor(source: any, value: string) {
		this.source = source;
		this.value = value;
	}
}
