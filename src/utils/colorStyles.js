const STYLE_GROUP_KEYS = {
	name: ["color", "fontSize"],
	code: ["color", "fontSize"],
	card: [
		"backgroundColor",
		"borderColor",
		"borderWidth",
		"borderRadius",
		"padding",
	],
};

const hasValue = (value) =>
	value !== "" && value !== undefined && value !== null;

const normalizeGroup = (value, group) => {
	const source = value && typeof value === "object" ? value : {};

	return STYLE_GROUP_KEYS[group].reduce((normalized, key) => {
		normalized[key] = hasValue(source[key]) ? source[key] : "";
		return normalized;
	}, {});
};

/**
 * Normalizes the persisted swatch style shape so editor and save code can rely
 * on every group/key existing even when individual values are unset.
 */
export const normalizeStyleGroups = (styleGroups = {}) =>
	Object.keys(STYLE_GROUP_KEYS).reduce((normalized, group) => {
		normalized[group] = normalizeGroup(styleGroups?.[group], group);
		return normalized;
	}, {});

/**
 * Applies per-swatch overrides on top of palette-level defaults without
 * changing the normalized style object shape.
 */
export const mergeStyleGroups = (defaults = {}, overrides = {}) => {
	const normalizedDefaults = normalizeStyleGroups(defaults);
	const normalizedOverrides = normalizeStyleGroups(overrides);

	return Object.keys(STYLE_GROUP_KEYS).reduce((merged, group) => {
		merged[group] = STYLE_GROUP_KEYS[group].reduce((styleGroup, key) => {
			styleGroup[key] = hasValue(normalizedOverrides[group][key])
				? normalizedOverrides[group][key]
				: normalizedDefaults[group][key];
			return styleGroup;
		}, {});

		return merged;
	}, {});
};

const addPxUnit = (value) => {
	if (!hasValue(value)) {
		return undefined;
	}

	if (typeof value === "number") {
		return `${value}px`;
	}

	if (/^\d+(\.\d+)?$/.test(value)) {
		return `${value}px`;
	}

	return value;
};

/**
 * Converts the typography subset into inline styles for swatch labels.
 */
export const getTypographyStyle = (styles = {}) => {
	const typographyStyle = {};

	if (hasValue(styles.color)) {
		typographyStyle.color = styles.color;
	}

	if (hasValue(styles.fontSize)) {
		typographyStyle.fontSize = addPxUnit(styles.fontSize);
	}

	return typographyStyle;
};

/**
 * Converts the swatch card subset into inline styles for wrapper rendering.
 */
export const getCardStyle = (styles = {}) => {
	const cardStyle = {};
	const borderWidth = hasValue(styles.borderWidth)
		? styles.borderWidth
		: hasValue(styles.borderColor)
		? 1
		: "";

	if (hasValue(styles.backgroundColor)) {
		cardStyle.backgroundColor = styles.backgroundColor;
	}

	if (hasValue(styles.padding)) {
		cardStyle.padding = addPxUnit(styles.padding);
	}

	if (hasValue(styles.borderRadius)) {
		cardStyle.borderRadius = addPxUnit(styles.borderRadius);
	}

	if (hasValue(borderWidth)) {
		cardStyle.borderStyle = "solid";
		cardStyle.borderWidth = addPxUnit(borderWidth);
		cardStyle.borderColor = styles.borderColor || "#dcdcde";
	}

	return cardStyle;
};
