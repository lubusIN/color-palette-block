/**
 * Internal dependencies
 */
import generateColorName from "../utils/generateColorName";
import {
	SWATCH_COLOR_BLOCK_NAME,
	SWATCH_CODE_BLOCK_NAME,
	SWATCH_NAME_BLOCK_NAME,
} from "../utils/createSwatchBlocks";
import { getThemeColorMatch } from "../utils/swatchColor";

export const ALLOWED_BLOCKS = [
	SWATCH_COLOR_BLOCK_NAME,
	SWATCH_NAME_BLOCK_NAME,
	SWATCH_CODE_BLOCK_NAME,
];

export const stripTags = (value = "") => value.replace(/<[^>]+>/g, "").trim();

/**
 * Resolves the preferred swatch label for the current color selection.
 *
 * Theme colors use the theme-provided name first, then slug, and only fall back
 * to generated names for custom colors.
 *
 * @param {Object} colorAttributes     Swatch color block attributes.
 * @param {string} resolvedColorValue  Resolved swatch color value.
 * @param {Array}  themeColors         Theme palette colors.
 * @return {string} Preferred swatch label.
 */
export const getSwatchLabel = (
	colorAttributes,
	resolvedColorValue,
	themeColors = [],
) => {
	const matchedThemeColor = getThemeColorMatch(colorAttributes, themeColors);

	if (matchedThemeColor?.name) {
		return matchedThemeColor.name;
	}

	if (matchedThemeColor?.slug) {
		return matchedThemeColor.slug;
	}

	return generateColorName(resolvedColorValue);
};

/**
 * Builds the locked inner block template for a swatch.
 *
 * @param {string} label      Swatch label.
 * @param {string} colorValue Resolved swatch color.
 * @param {string} colorCode  Display-ready uppercase code.
 * @return {Array} Locked inner block template.
 */
export const buildSwatchTemplate = (label, colorValue, colorCode) => [
	[
		SWATCH_COLOR_BLOCK_NAME,
		{
			label,
			style: {
				color: {
					background: colorValue,
				},
			},
		},
	],
	[
		SWATCH_NAME_BLOCK_NAME,
		{
			content: label,
		},
	],
	[
		SWATCH_CODE_BLOCK_NAME,
		{
			content: colorCode,
		},
	],
];
