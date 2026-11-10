import { expect } from "chai";
import merge from "lodash-es/merge";
import ComponentTests from "../exported-tests/component-tests";

const defaults = {
	selectors: {
		root: "cds-checkbox",
		input: "input"
	}
};

class CheckboxExportedTests extends ComponentTests {
	constructor(configs) {
		super(merge({}, defaults, configs));
		this.tests = this.tests.concat(this.structure());
	}

	structure() {
		const tests = [
			{
				name: "initially be unchecked, be checked on click",
				getActual: fragment =>
					new Promise(resolve => {
						// The <input> lives in the web component's shadow root;
						// `checked` is mirrored on the host element.
						const component = this.getComponent(fragment, this.settings.selectors.root);
						const initialState = component.checked;
						component.shadowRoot.querySelector(this.settings.selectors.input).click();
						const afterClickState = component.checked;
						resolve({
							initialState,
							afterClickState
						});
					}),
				runComparison: results => {
					// eslint-disable-next-line @typescript-eslint/no-unused-expressions
					expect(results.initialState).to.be.false;
					// eslint-disable-next-line @typescript-eslint/no-unused-expressions
					expect(results.afterClickState).to.be.true;
				}
			}
		];
		return [{
			name: "Basic checkbox tests",
			tests: this.getTests(tests)
		}];
	}
}

export default CheckboxExportedTests;
