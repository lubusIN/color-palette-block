/**
 * Internal dependencies
 */
import { normalizeColorToHex } from "./colorValue";

/**
 * Resolves the selected theme color record from swatch block attributes.
 *
 * @param {Object} attributes  Swatch color block attributes.
 * @param {Array}  themeColors Theme palette colors.
 * @return {Object|null} Matched theme color or null.
 */
export const getThemeColorMatch = (attributes = {}, themeColors = []) => {
	const backgroundSlug = attributes?.backgroundColor;

	if (!backgroundSlug) {
		return null;
	}

	return (
		themeColors.find((themeColor) => themeColor?.slug === backgroundSlug) ||
		null
	);
};

/**
 * Resolves the effective swatch color from block attributes and theme color
 * references.
 *
 * @param {Object} attributes  Swatch color block attributes.
 * @param {Array}  themeColors Theme palette colors.
 * @return {string} Resolved hex color or an empty string.
 */
export const resolveSwatchColorValue = (attributes = {}, themeColors = []) => {
	const customBackground = normalizeColorToHex(
		attributes?.style?.color?.background,
	);

	if (customBackground) {
		return customBackground;
	}

	const matchedThemeColor = getThemeColorMatch(attributes, themeColors);
	const themeColorValue = normalizeColorToHex(matchedThemeColor?.color);

	if (themeColorValue) {
		return themeColorValue;
	}

	return "";
};
