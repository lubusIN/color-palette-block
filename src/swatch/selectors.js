/**
 * Internal dependencies
 */
import {
	getCurrentSwatchChildBlocks,
	getSiblingSwatches,
} from "../utils/swatchSync";

/**
 * Collects the selected swatch state from the editor store in one place so the
 * component body stays focused on behavior instead of store plumbing.
 *
 * @param {Function} select   Gutenberg selector registry.
 * @param {string}   clientId Swatch client id.
 * @return {Object} Swatch editor state.
 */
export const selectSwatchEditorState = (select, clientId) => {
	const blockEditor = select("core/block-editor");
	const settings = blockEditor.getSettings();
	const innerBlocks = blockEditor.getBlocks(clientId);
	const { nameBlock, codeBlock, colorBlock } =
		getCurrentSwatchChildBlocks(innerBlocks);

	return {
		themeColors: settings.colors || [],
		nameBlockClientId: nameBlock?.clientId || null,
		nameBlockContent: nameBlock?.attributes?.content || "",
		nameBlockAttributes: nameBlock?.attributes || {},
		codeBlockClientId: codeBlock?.clientId || null,
		codeBlockContent: codeBlock?.attributes?.content || "",
		codeBlockAttributes: codeBlock?.attributes || {},
		colorBlockClientId: colorBlock?.clientId || null,
		colorBlockAttributes: colorBlock?.attributes || {},
		colorBlockLabel: colorBlock?.attributes?.label || "",
		siblingSwatches: getSiblingSwatches(blockEditor, clientId),
	};
};
