import {
	SWATCH_CODE_BLOCK_NAME,
	SWATCH_COLOR_BLOCK_NAME,
	SWATCH_NAME_BLOCK_NAME,
} from "./createSwatchBlocks";

const SWATCH_SYNC_OPTIONS = {
	swatch: {
		excludedKeys: ["color", "name"],
	},
	color: {
		excludedKeys: ["label"],
		excludeSwatchBackground: true,
	},
	name: {
		excludedKeys: ["content"],
	},
	code: {
		excludedKeys: ["content"],
	},
};

const isPlainObject = (value) =>
	Boolean(value) && typeof value === "object" && !Array.isArray(value);

const deepClone = (value) => {
	if (Array.isArray(value)) {
		return value.map((item) => deepClone(item));
	}

	if (!isPlainObject(value)) {
		return value;
	}

	return Object.entries(value).reduce((clonedValue, [key, item]) => {
		clonedValue[key] = deepClone(item);
		return clonedValue;
	}, {});
};

const getSyncableSwatchStyle = (attributes = {}) => {
	const nextStyle = deepClone(attributes.style || {});

	if (!isPlainObject(nextStyle)) {
		return {};
	}

	if (isPlainObject(nextStyle.color)) {
		delete nextStyle.color.background;

		if (Object.keys(nextStyle.color).length === 0) {
			delete nextStyle.color;
		}
	}

	return nextStyle;
};

/**
 * Returns the subset of block attributes that should be copied when syncing
 * swatch styles to sibling blocks.
 */
const getSyncableBlockAttributes = (
	attributes = {},
	{ excludedKeys = [], excludeSwatchBackground = false } = {},
) => {
	const syncableAttributes = {};

	Object.entries(attributes || {}).forEach(([key, value]) => {
		if (excludedKeys.includes(key) || value === undefined) {
			return;
		}

		if (key === "style") {
			syncableAttributes.style = excludeSwatchBackground
				? getSyncableSwatchStyle({ style: value })
				: deepClone(value);
			return;
		}

		if (excludeSwatchBackground && key === "backgroundColor") {
			return;
		}

		syncableAttributes[key] = deepClone(value);
	});

	if (
		syncableAttributes.style &&
		Object.keys(syncableAttributes.style).length === 0
	) {
		delete syncableAttributes.style;
	}

	return syncableAttributes;
};

const hasSyncableBlockAttributes = (attributes = {}, options = {}) =>
	Object.keys(getSyncableBlockAttributes(attributes, options)).length > 0;

const mergeSyncedBlockAttributes = (
	targetAttributes = {},
	sourceAttributes = {},
	options = {},
) => ({
	...deepClone(targetAttributes),
	...getSyncableBlockAttributes(sourceAttributes, options),
});

const findChildBlock = (blocks = [], blockName) =>
	blocks.find((block) => block.name === blockName) || null;

/**
 * Finds the locked child blocks that make up a swatch so callers do not need to
 * repeat block-name lookups.
 */
export const getCurrentSwatchChildBlocks = (blocks = []) => ({
	nameBlock: findChildBlock(blocks, SWATCH_NAME_BLOCK_NAME),
	codeBlock: findChildBlock(blocks, SWATCH_CODE_BLOCK_NAME),
	colorBlock: findChildBlock(blocks, SWATCH_COLOR_BLOCK_NAME),
});

/**
 * Collects the sibling swatches within the parent palette together with their
 * relevant child blocks for cross-swatch sync operations.
 */
export const getSiblingSwatches = (blockEditor, clientId) => {
	const paletteClientId = blockEditor.getBlockRootClientId(clientId);
	const paletteBlocks = paletteClientId
		? blockEditor.getBlocks(paletteClientId)
		: [];

	return paletteBlocks.map((swatchBlock) => ({
		clientId: swatchBlock.clientId,
		attributes: swatchBlock.attributes || {},
		...getCurrentSwatchChildBlocks(swatchBlock.innerBlocks),
	}));
};

/**
 * Determines whether the selected swatch has any syncable styles besides its
 * actual color value.
 */
export const hasSyncableSwatchStyles = ({
	swatchAttributes = {},
	colorAttributes = {},
	nameAttributes = {},
	codeAttributes = {},
}) =>
	hasSyncableBlockAttributes(swatchAttributes, SWATCH_SYNC_OPTIONS.swatch) ||
	hasSyncableBlockAttributes(colorAttributes, SWATCH_SYNC_OPTIONS.color) ||
	hasSyncableBlockAttributes(nameAttributes, SWATCH_SYNC_OPTIONS.name) ||
	hasSyncableBlockAttributes(codeAttributes, SWATCH_SYNC_OPTIONS.code);

/**
 * Copies the selected swatch styles to sibling swatches while intentionally
 * preserving each sibling's swatch background color.
 */
export const syncSiblingSwatchStyles = ({
	sourceClientId,
	siblingSwatches = [],
	swatchAttributes = {},
	colorAttributes = {},
	nameAttributes = {},
	codeAttributes = {},
	updateBlockAttributes,
}) => {
	const hasSyncableSwatch = hasSyncableBlockAttributes(
		swatchAttributes,
		SWATCH_SYNC_OPTIONS.swatch,
	);
	const hasSyncableColor = hasSyncableBlockAttributes(
		colorAttributes,
		SWATCH_SYNC_OPTIONS.color,
	);
	const hasSyncableName = hasSyncableBlockAttributes(
		nameAttributes,
		SWATCH_SYNC_OPTIONS.name,
	);
	const hasSyncableCode = hasSyncableBlockAttributes(
		codeAttributes,
		SWATCH_SYNC_OPTIONS.code,
	);

	siblingSwatches
		.filter((swatchBlock) => swatchBlock.clientId !== sourceClientId)
		.forEach((swatchBlock) => {
			if (hasSyncableSwatch) {
				updateBlockAttributes(
					swatchBlock.clientId,
					mergeSyncedBlockAttributes(
						swatchBlock.attributes,
						swatchAttributes,
						SWATCH_SYNC_OPTIONS.swatch,
					),
				);
			}

			if (hasSyncableColor && swatchBlock.colorBlock?.clientId) {
				updateBlockAttributes(
					swatchBlock.colorBlock.clientId,
					mergeSyncedBlockAttributes(
						swatchBlock.colorBlock.attributes || {},
						colorAttributes,
						SWATCH_SYNC_OPTIONS.color,
					),
				);
			}

			if (hasSyncableName && swatchBlock.nameBlock?.clientId) {
				updateBlockAttributes(
					swatchBlock.nameBlock.clientId,
					mergeSyncedBlockAttributes(
						swatchBlock.nameBlock.attributes || {},
						nameAttributes,
						SWATCH_SYNC_OPTIONS.name,
					),
				);
			}

			if (hasSyncableCode && swatchBlock.codeBlock?.clientId) {
				updateBlockAttributes(
					swatchBlock.codeBlock.clientId,
					mergeSyncedBlockAttributes(
						swatchBlock.codeBlock.attributes || {},
						codeAttributes,
						SWATCH_SYNC_OPTIONS.code,
					),
				);
			}
		});
};
