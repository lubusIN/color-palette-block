/**
 * WordPress dependencies
 */
import { registerBlockType } from "@wordpress/blocks";
import { textColor } from "@wordpress/icons";

/**
 * Internal dependencies
 */
import metadata from "./block.json";
import Edit from "./edit";
import save from "./save";

/**
 * Registers the Color Name block.
 */
registerBlockType(metadata, {
	icon: textColor,
	edit: Edit,
	save,
});
