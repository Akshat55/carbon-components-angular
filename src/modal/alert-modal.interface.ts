/**
 * Copyright IBM Corp. 2024
 *
 * Interfaces for `ModalService.show()` — unchanged from
 * carbon-components-angular so existing call sites keep compiling.
 */

export enum ModalButtonType {
	primary = "primary",
	secondary = "secondary",
	tertiary = "tertiary",
	ghost = "ghost",
	danger = "danger",
	danger_primary = "danger--primary"
}

export enum AlertModalType {
	default = "default",
	danger = "danger"
}

export interface ModalButton {
	/**
	 * Button text.
	 */
	text: string;
	/**
	 * Button type — maps to the footer button's `kind`.
	 */
	type?: ModalButtonType | string;
	/**
	 * Invoked when the button is clicked (before the modal closes).
	 */
	click?: Function;
}

export interface AlertModalData {
	/**
	 * Use of `modalType` is deprecated, use `type` instead.
	 */
	modalType?: string;
	/**
	 * Modal type — 'default' or 'danger'.
	 */
	type?: AlertModalType | string;
	/**
	 * Modal label (small text above the title).
	 */
	label?: string;
	/**
	 * Modal title.
	 */
	title?: string;
	/**
	 * Modal body content (plain text or HTML string).
	 */
	content?: string;
	/**
	 * Modal size.
	 */
	size?: "xs" | "sm" | "md" | "lg";
	/**
	 * Set to `true` to render without a visible close ("x") button.
	 */
	hasScrollingContent?: boolean;
	/**
	 * Show the close button (default true).
	 */
	showCloseButton?: boolean;
	/**
	 * Footer buttons.
	 */
	buttons?: Array<ModalButton>;
	/**
	 * Invoked when the modal closes. Return `false` to keep the modal open.
	 */
	close?: Function;
}
