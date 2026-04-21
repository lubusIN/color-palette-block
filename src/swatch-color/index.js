/**
 * WordPress dependencies
 */
import { registerBlockType } from "@wordpress/blocks";
import { color } from "@wordpress/icons";

/**
 * Internal dependencies
 */
import metadata from "./block.json";
import Edit from "./edit";
import save from "./save";

/**
 * Registers the Swatch Color block.
 */
registerBlockType(metadata, {
	icon: color,
	edit: Edit,
	save,
});
