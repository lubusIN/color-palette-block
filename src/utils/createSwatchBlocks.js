import { createBlock } from "@wordpress/blocks";
import generateColorName from "./generateColorName";
import { mergeStyleGroups, normalizeStyleGroups } from "./colorStyles";
import { normalizeColorToHex } from "./colorValue";

export const SWATCH_BLOCK_NAME = "lubus/color-palette-swatch";
export const SWATCH_COLOR_BLOCK_NAME = "lubus/color-palette-swatch-color";
export const SWATCH_NAME_BLOCK_NAME = "lubus/color-palette-swatch-name";
export const SWATCH_CODE_BLOCK_NAME = "lubus/color-palette-swatch-code";

/**
 * Resolves legacy color payloads to the canonical swatch hex value.
 */
const resolveSwatchColor = (colorItem = {}) =>
	normalizeColorToHex(colorItem.color || colorItem.code || "") || "#000000";

/**
 * Resolves the display name for a swatch, falling back to generated labels when
 * the imported palette data is incomplete.
 */
const resolveSwatchName = (
	colorItem = {},
	fallbackColor = resolveSwatchColor(colorItem),
) => colorItem.name || colorItem.swatch || generateColorName(fallbackColor);

export const createSwatchColorBlock = (label = "", color = "#000000") =>
	createBlock(SWATCH_COLOR_BLOCK_NAME, {
		label,
		style: {
			color: {
				background: color,
			},
		},
	});

const createSwatchNameBlock = (content = "") =>
	createBlock(SWATCH_NAME_BLOCK_NAME, {
		content,
	});

const createSwatchCodeBlock = (content = "#000000") =>
	createBlock(SWATCH_CODE_BLOCK_NAME, {
		content,
	});

/**
 * Builds the parent swatch attributes from imported color data plus palette
 * defaults so deprecations and new insertions share the same shape.
 */
const buildSwatchAttributes = (colorItem = {}, options = {}) => {
	const normalizedColor = resolveSwatchColor(colorItem);
	const defaultStyles = normalizeStyleGroups(options.defaultStyles);
	const overrideStyles = normalizeStyleGroups(colorItem.styles || {});
	const name = resolveSwatchName(colorItem, normalizedColor);

	return {
		color: normalizedColor,
		name,
		styles: mergeStyleGroups(defaultStyles, overrideStyles),
	};
};

/**
 * Creates the locked child block structure used by each swatch.
 */
export const createSwatchInnerBlocks = (name = "", color = "#000000") => [
	createSwatchColorBlock(name, color),
	createSwatchNameBlock(name),
	createSwatchCodeBlock(color.toUpperCase()),
];

export const createSwatchBlock = (colorItem = {}, options = {}) => {
	const normalizedColor = resolveSwatchColor(colorItem);
	const name = resolveSwatchName(colorItem, normalizedColor);

	return createBlock(
		SWATCH_BLOCK_NAME,
		buildSwatchAttributes(colorItem, options),
		createSwatchInnerBlocks(name, normalizedColor),
	);
};

/**
 * Converts legacy array-based palettes into swatch blocks while skipping empty
 * or malformed entries.
 */
export const createSwatchBlocksFromColors = (colors = [], options = {}) =>
	colors
		.filter(
			(colorItem) =>
				colorItem && (colorItem.color || colorItem.code || colorItem.swatch),
		)
		.map((colorItem) => createSwatchBlock(colorItem, options));
