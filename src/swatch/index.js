/**
 * WordPress dependencies
 */
import { registerBlockType } from "@wordpress/blocks";
import { swatch } from "@wordpress/icons";

/**
 * Internal dependencies
 */
import metadata from "./block.json";
import Edit from "./edit";
import save from "./save";
import deprecated from "./deprecated";

/**
 * Registers the Color Palette Swatch block.
 */
registerBlockType(metadata, {
	icon: swatch,
	edit: Edit,
	save,
	deprecated,
});
