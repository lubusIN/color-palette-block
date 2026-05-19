/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import {
	hasSyncableSwatchStyles,
	syncSiblingSwatchStyles,
} from "../utils/swatchSync";

/**
 * Determines whether the current swatch has styles that can be copied.
 *
 * @param {Object} options Sync state.
 * @return {boolean} Whether the sync action should be enabled.
 */
export const canSyncSwatchStyles = ({
	attributes,
	colorBlockAttributes,
	codeBlockAttributes,
	nameBlockAttributes,
	siblingSwatches,
}) =>
	siblingSwatches.length > 1 &&
	hasSyncableSwatchStyles({
		swatchAttributes: attributes,
		colorAttributes: colorBlockAttributes,
		nameAttributes: nameBlockAttributes,
		codeAttributes: codeBlockAttributes,
	});

/**
 * Copies the selected swatch styles to sibling swatches.
 *
 * @param {Object} options Sync options.
 * @return {void}
 */
export const syncSwatchStylesToSiblings = ({
	attributes,
	clientId,
	codeBlockAttributes,
	colorBlockAttributes,
	createSuccessNotice,
	nameBlockAttributes,
	siblingSwatches,
	updateBlockAttributes,
}) => {
	syncSiblingSwatchStyles({
		sourceClientId: clientId,
		siblingSwatches,
		swatchAttributes: attributes,
		colorAttributes: colorBlockAttributes,
		nameAttributes: nameBlockAttributes,
		codeAttributes: codeBlockAttributes,
		updateBlockAttributes,
	});

	createSuccessNotice(
		__(
			"Swatch styles synced without changing swatch colors.",
			"color-palette-block",
		),
		{
			type: "snackbar",
		},
	);
};
