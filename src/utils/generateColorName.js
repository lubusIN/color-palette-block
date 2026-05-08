/**
 * Generate a human-readable color name from a hex string.
 * Shared between the editor UI and legacy migrations.
 */

/**
 * Internal dependencies
 */
import { hexToHsl } from "./colorValue";

const GRAY_NAMES = [
	{ min: 0, max: 5, name: "Black" },
	{ min: 6, max: 15, name: "Charcoal" },
	{ min: 16, max: 25, name: "Dark Gray" },
	{ min: 26, max: 35, name: "Graphite" },
	{ min: 36, max: 45, name: "Slate" },
	{ min: 46, max: 55, name: "Gray" },
	{ min: 56, max: 65, name: "Stone" },
	{ min: 66, max: 75, name: "Silver" },
	{ min: 76, max: 85, name: "Light Gray" },
	{ min: 86, max: 92, name: "Smoke" },
	{ min: 93, max: 97, name: "Snow" },
	{ min: 98, max: 100, name: "White" },
];

const COLOR_RANGES = [
	{ min: 0, max: 10, base: ["Crimson", "Dark Red", "Maroon", "Burgundy"] },
	{ min: 11, max: 20, base: ["Red", "Cherry", "Ruby", "Scarlet"] },
	{ min: 21, max: 30, base: ["Coral", "Salmon", "Tomato", "Rose"] },
	{ min: 31, max: 45, base: ["Orange", "Tangerine", "Rust", "Copper"] },
	{
		min: 46,
		max: 60,
		base: ["Peach", "Apricot", "Papaya", "Sandy Brown"],
	},
	{ min: 61, max: 75, base: ["Yellow", "Gold", "Amber", "Mustard"] },
	{
		min: 76,
		max: 90,
		base: ["Lime", "Chartreuse", "Yellow Green", "Spring Green"],
	},
	{ min: 91, max: 120, base: ["Green", "Forest Green", "Emerald", "Jade"] },
	{ min: 121, max: 150, base: ["Teal", "Turquoise", "Sea Green", "Pine"] },
	{
		min: 151,
		max: 180,
		base: ["Cyan", "Aqua", "Turquoise", "Light Sea Green"],
	},
	{
		min: 181,
		max: 210,
		base: ["Sky Blue", "Light Blue", "Powder Blue", "Steel Blue"],
	},
	{
		min: 211,
		max: 240,
		base: ["Blue", "Royal Blue", "Navy", "Midnight Blue"],
	},
	{
		min: 241,
		max: 270,
		base: ["Purple", "Violet", "Indigo", "Dark Violet"],
	},
	{ min: 271, max: 300, base: ["Magenta", "Fuchsia", "Orchid", "Plum"] },
	{ min: 301, max: 330, base: ["Pink", "Hot Pink", "Deep Pink", "Rose"] },
	{ min: 331, max: 360, base: ["Crimson", "Red", "Burgundy", "Wine"] },
];

/**
 * Matches neutral colors to a named grayscale bucket.
 *
 * @param {number} lightnessPercent HSL lightness percentage.
 * @return {string} Gray family color name.
 */
const getGrayName = (lightnessPercent) => {
	for (const gray of GRAY_NAMES) {
		if (lightnessPercent >= gray.min && lightnessPercent <= gray.max) {
			return gray.name;
		}
	}

	return "Gray";
};

/**
 * Picks a base hue family name using hue, saturation, and lightness.
 *
 * @param {number} hue              HSL hue.
 * @param {number} saturation       HSL saturation percentage.
 * @param {number} lightnessPercent HSL lightness percentage.
 * @return {string} Base color family name.
 */
const getBaseColorName = (hue, saturation, lightnessPercent) => {
	for (const range of COLOR_RANGES) {
		if (hue >= range.min && hue <= range.max) {
			const nameIndex = Math.min(
				Math.floor((saturation + lightnessPercent) / 50),
				range.base.length - 1,
			);

			return range.base[nameIndex];
		}
	}

	return "Color";
};

/**
 * Builds the descriptive modifiers that prefix the base color family name.
 *
 * @param {number} saturation       HSL saturation percentage.
 * @param {number} lightnessPercent HSL lightness percentage.
 * @return {string[]} Ordered modifier list.
 */
const getColorModifiers = (saturation, lightnessPercent) => {
	const modifiers = [];

	if (lightnessPercent < 15) {
		modifiers.push("Very Dark");
	} else if (lightnessPercent < 30) {
		modifiers.push("Dark");
	} else if (lightnessPercent > 90) {
		modifiers.push("Very Light");
	} else if (lightnessPercent > 75) {
		modifiers.push("Light");
	} else if (lightnessPercent > 60 && saturation < 40) {
		modifiers.push("Pale");
	}

	if (saturation > 85) {
		modifiers.push("Vivid");
	} else if (saturation > 70) {
		modifiers.push("Bright");
	} else if (saturation < 30) {
		modifiers.push("Muted");
	}

	return modifiers.filter((modifier, index, array) => {
		if (modifier === "Dark" && array.includes("Very Dark")) {
			return false;
		}

		if (modifier === "Light" && array.includes("Very Light")) {
			return false;
		}

		return true;
	});
};

/**
 * Generates a descriptive color name from a six-character hex string.
 *
 * @param {string} hexColor Hex color string.
 * @return {string} Generated color name.
 */
const generateColorName = (hexColor) => {
	const hsl = hexToHsl(hexColor);

	if (!hsl) {
		return "Untitled Color";
	}

	const { h: hue, s: saturation, l: lightnessPercent } = hsl;

	if (saturation < 10) {
		return getGrayName(lightnessPercent);
	}

	const baseName = getBaseColorName(hue, saturation, lightnessPercent);
	const modifiers = getColorModifiers(saturation, lightnessPercent);

	return modifiers.length > 0 ? `${modifiers.join(" ")} ${baseName}` : baseName;
};

export default generateColorName;
