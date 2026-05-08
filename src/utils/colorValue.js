const RGB_COLOR_PATTERN =
	/^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})(?:[\s,/]+[\d.]+)?\s*\)$/i;
const HSL_COLOR_PATTERN =
	/^hsla?\(\s*(-?\d+(?:\.\d+)?)\s*(?:deg)?[\s,]+(\d+(?:\.\d+)?)%[\s,]+(\d+(?:\.\d+)?)%(?:[\s,/]+[\d.]+)?\s*\)$/i;
const HEX_COLOR_PATTERN = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

/**
 * Converts an RGB channel value to the valid 0-255 range.
 *
 * @param {number|string} value Channel value.
 * @return {number} Clamped channel value.
 */
const clampRgbChannel = (value) =>
	Math.max(0, Math.min(255, Number.parseInt(value, 10) || 0));

/**
 * Converts a percentage value to the valid 0-100 range.
 *
 * @param {number|string} value Percentage value.
 * @return {number} Clamped percentage value.
 */
const clampPercentage = (value) =>
	Math.max(0, Math.min(100, Number.parseFloat(value) || 0));

/**
 * Converts HSL values to a normalized hex color.
 *
 * @param {number} hue        Hue value.
 * @param {number} saturation Saturation percentage.
 * @param {number} lightness  Lightness percentage.
 * @return {string} Hex color.
 */
const hslToHex = (hue, saturation, lightness) => {
	const normalizedHue = ((hue % 360) + 360) % 360;
	const normalizedSaturation = clampPercentage(saturation) / 100;
	const normalizedLightness = clampPercentage(lightness) / 100;
	const chroma =
		(1 - Math.abs(2 * normalizedLightness - 1)) * normalizedSaturation;
	const intermediate = chroma * (1 - Math.abs(((normalizedHue / 60) % 2) - 1));
	const matchLightness = normalizedLightness - chroma / 2;

	let red = 0;
	let green = 0;
	let blue = 0;

	if (normalizedHue < 60) {
		red = chroma;
		green = intermediate;
	} else if (normalizedHue < 120) {
		red = intermediate;
		green = chroma;
	} else if (normalizedHue < 180) {
		green = chroma;
		blue = intermediate;
	} else if (normalizedHue < 240) {
		green = intermediate;
		blue = chroma;
	} else if (normalizedHue < 300) {
		red = intermediate;
		blue = chroma;
	} else {
		red = chroma;
		blue = intermediate;
	}

	return `#${[red, green, blue]
		.map((channel) =>
			Math.round((channel + matchLightness) * 255)
				.toString(16)
				.padStart(2, "0"),
		)
		.join("")
		.toUpperCase()}`;
};

/**
 * Normalizes supported CSS color strings to six-character hex colors.
 *
 * @param {string} value CSS color value.
 * @return {string} Normalized hex color or an empty string.
 */
export const normalizeColorToHex = (value = "") => {
	if (!value || typeof value !== "string") {
		return "";
	}

	const normalizedValue = value.trim();

	if (
		!normalizedValue ||
		normalizedValue.startsWith("var(") ||
		normalizedValue.startsWith("var:")
	) {
		return "";
	}

	const rgbMatch = normalizedValue.match(RGB_COLOR_PATTERN);

	if (rgbMatch) {
		return `#${rgbMatch
			.slice(1, 4)
			.map((channel) => clampRgbChannel(channel).toString(16).padStart(2, "0"))
			.join("")
			.toUpperCase()}`;
	}

	const hslMatch = normalizedValue.match(HSL_COLOR_PATTERN);

	if (hslMatch) {
		return hslToHex(
			Number.parseFloat(hslMatch[1]),
			Number.parseFloat(hslMatch[2]),
			Number.parseFloat(hslMatch[3]),
		);
	}

	if (!normalizedValue.startsWith("#")) {
		return "";
	}

	const hexValue = normalizedValue.slice(1);

	if (hexValue.length === 3) {
		return `#${hexValue
			.split("")
			.map((digit) => `${digit}${digit}`)
			.join("")
			.toUpperCase()}`;
	}

	if (hexValue.length === 6) {
		return `#${hexValue.toUpperCase()}`;
	}

	return "";
};

/**
 * Converts a hex color into RGB values.
 *
 * @param {string} value Color value.
 * @return {Object|null} RGB object or null when invalid.
 */
export const hexToRgb = (value) => {
	const normalizedHex = normalizeColorToHex(value);

	if (!normalizedHex) {
		return null;
	}

	const result = HEX_COLOR_PATTERN.exec(normalizedHex);

	if (!result) {
		return null;
	}

	return {
		r: Number.parseInt(result[1], 16),
		g: Number.parseInt(result[2], 16),
		b: Number.parseInt(result[3], 16),
	};
};

/**
 * Converts a hex color into HSL values.
 *
 * @param {string} value Color value.
 * @return {Object|null} HSL object or null when invalid.
 */
export const hexToHsl = (value) => {
	const rgb = hexToRgb(value);

	if (!rgb) {
		return null;
	}

	let { r, g, b } = rgb;
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h,
		s,
		l = (max + min) / 2;

	if (max === min) {
		h = s = 0;
	} else {
		const diff = max - min;
		s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

		switch (max) {
			case r:
				h = (g - b) / diff + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / diff + 2;
				break;
			case b:
				h = (r - g) / diff + 4;
				break;
		}

		h /= 6;
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	};
};
