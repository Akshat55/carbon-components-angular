export class RadioChange {
	/**
	 * The `cds-radio-button` element that was checked.
	 */
	source: HTMLElement | null;
	/**
	 * Its `value`.
	 */
	value: string;

	constructor(source: HTMLElement | null, value: string) {
		this.source = source;
		this.value = value;
	}
}
