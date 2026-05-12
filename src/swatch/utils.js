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

export const stripTags = (value = "") =>
	String(value).replace(/<[^>]+>/g, "").trim();

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
