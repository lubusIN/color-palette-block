/**
 * WordPress dependencies
 */
import { registerBlockType } from "@wordpress/blocks";
import { code } from "@wordpress/icons";

/**
 * Internal dependencies
 */
import metadata from "./block.json";
import Edit from "./edit";
import save from "./save";

/**
 * Registers the Color Code block.
 */
registerBlockType(metadata, {
	icon: code,
	edit: Edit,
	save,
});
