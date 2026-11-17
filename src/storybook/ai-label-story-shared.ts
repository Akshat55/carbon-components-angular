/**
 * Shared Storybook snippets for `cds-ai-label` (AI label) stories.
 */

/**
 * Only used by the table v1 stories; the web component stories need no styles of their own.
 */
export const AI_LABEL_STORY_STYLES = [`
	.ai-label-container {
		display: flex;
		align-items: flex-start;
		margin-bottom: 6rem;
	}
	.ai-label-container > * {
		margin-left: 2rem;
	}
	.ai-label-container p {
		font-size: 0.875rem;
		line-height: 1.125rem;
		font-weight: 400;
		margin: 0;
	}
	.ai-label-container .secondary {
		color: var(--cds-text-secondary);
	}
	.ai-label-container .bold {
		font-weight: 600;
	}
	.ai-label-container .ai-label-heading {
		font-size: 2.625rem;
		font-weight: 300;
		margin-bottom: 1rem;
	}
	.ai-label-container hr {
		border: 0;
		height: 1px;
		background: var(--cds-border-subtle);
		margin-top: 2rem;
		margin-bottom: 2rem;
	}
	.ai-label-check-radio-container .cds--form-item:not(:first-of-type):not(.cds--checkbox-wrapper),
	.ai-label-check-radio-container fieldset.cds--checkbox-group:not(:first-of-type) {
		margin-top: 2rem;
	}
`];

/**
 * Popover body markup (no actions).
 */
export const AI_LABEL_BODY_HTML = `
	<div>
		<p>AI Explained</p>
		<h2>84%</h2>
		<p><strong>Confidence score</strong></p>
		<p>
			Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do
			eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
		</p>
		<hr />
		<p>Model type</p>
		<p><strong>Foundation model</strong></p>
	</div>
`;

/**
 * Icon + primary action row for cds-ai-label (cdsAILabelActions).
 */
export const AI_LABEL_ACTIONS_HTML = `
	<div cdsAILabelActions>
		<cds-icon-button kind="ghost" align="top" description="View">
			<svg cdsIcon="view" size="16"></svg>
		</cds-icon-button>
		<cds-icon-button kind="ghost" align="top" description="Download">
			<svg cdsIcon="download" size="16"></svg>
		</cds-icon-button>
		<cds-icon-button kind="ghost" align="top" description="Folders">
			<svg cdsIcon="folder" size="16"></svg>
		</cds-icon-button>
		<cds-ai-label-action-button>View details</cds-ai-label-action-button>
	</div>
`;

/**
 * Full projected content for `cds-ai-label` (body + actions).
 */
export const AI_LABEL_INNER = `${AI_LABEL_BODY_HTML}\n${AI_LABEL_ACTIONS_HTML}`;

/**
 * Mini badge only — typical field / tile / dropdown decorator.
 */
export const AI_LABEL_DECORATOR_MINI = `<cds-ai-label size="mini" aiText="AI"></cds-ai-label>`;

/**
 * Small badge — modal header / simple decorator.
 */
export const AI_LABEL_DECORATOR_SM = `<cds-ai-label size="sm" aiText="AI"></cds-ai-label>`;

/**
 * Inline small — typical tag decorator.
 */
export const AI_LABEL_DECORATOR_TAG_INLINE = `<cds-ai-label size="sm" kind="inline" aiText="AI"></cds-ai-label>`;
