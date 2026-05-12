/**
 * WordPress dependencies
 */
import { useEffect, useRef } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { createSwatchColorBlock } from "../utils/createSwatchBlocks";
import { getSwatchLabel, stripTags } from "./utils";

/**
 * Updates a child block only when the derived value has changed.
 *
 * @param {string|null} blockClientId          Child block client id.
 * @param {*}           currentValue           Existing child value.
 * @param {*}           nextValue              Next derived value.
 * @param {Object}      nextAttributes         Attributes to persist.
 * @param {Function}    updateBlockAttributes  Gutenberg block updater.
 * @return {void}
 */
const syncBlockAttribute = (
	blockClientId,
	currentValue,
	nextValue,
	nextAttributes,
	updateBlockAttributes,
) => {
	if (!blockClientId || currentValue === nextValue) {
		return;
	}

	updateBlockAttributes(blockClientId, nextAttributes);
};

/**
 * Synchronizes one derived child block attribute.
 *
 * @param {Object} options Sync options.
 * @return {void}
 */
const useSyncedBlockAttribute = ({
	attributeName,
	blockClientId,
	currentValue,
	nextValue,
	updateBlockAttributes,
}) => {
	useEffect(() => {
		syncBlockAttribute(
			blockClientId,
			currentValue,
			nextValue,
			{ [attributeName]: nextValue },
			updateBlockAttributes,
		);
	}, [
		attributeName,
		blockClientId,
		currentValue,
		nextValue,
		updateBlockAttributes,
	]);
};

/**
 * Keeps the swatch parent attributes and locked child blocks aligned with the
 * selected swatch color.
 *
 * @param {Object} options Synchronization options.
 * @return {void}
 */
export const useSwatchChildSync = ({
	clientId,
	colorBlockAttributes,
	colorBlockClientId,
	colorBlockLabel,
	colorCode,
	codeBlockClientId,
	codeBlockContent,
	fallbackName,
	insertBlocks,
	name,
	nameBlockClientId,
	nameBlockContent,
	resolvedColorValue,
	setAttributes,
	themeColors,
	updateBlockAttributes,
}) => {
	const previousResolvedColorRef = useRef(resolvedColorValue);
	const pendingGeneratedNameRef = useRef(null);

	useEffect(() => {
		const normalizedName = stripTags(nameBlockContent);
		const normalizedParentName = stripTags(name);

		if (pendingGeneratedNameRef.current) {
			if (normalizedName === pendingGeneratedNameRef.current) {
				pendingGeneratedNameRef.current = null;
			}

			return;
		}

		if (normalizedName && normalizedName !== normalizedParentName) {
			setAttributes({ name: normalizedName });
		}
	}, [name, nameBlockContent, setAttributes]);

	useEffect(() => {
		if (!colorBlockClientId) {
			insertBlocks(
				createSwatchColorBlock(fallbackName, resolvedColorValue),
				0,
				clientId,
			);
		}
	}, [
		clientId,
		colorBlockClientId,
		fallbackName,
		insertBlocks,
		resolvedColorValue,
	]);

	useEffect(() => {
		const previousResolvedColor = previousResolvedColorRef.current;

		if (resolvedColorValue === previousResolvedColor) {
			return;
		}

		const nextGeneratedName = getSwatchLabel(
			colorBlockAttributes,
			resolvedColorValue,
			themeColors,
		);

		setAttributes({
			color: resolvedColorValue,
			name: nextGeneratedName,
		});

		pendingGeneratedNameRef.current = nextGeneratedName;

		if (nameBlockClientId) {
			updateBlockAttributes(nameBlockClientId, {
				content: nextGeneratedName,
			});
		}

		previousResolvedColorRef.current = resolvedColorValue;
	}, [
		nameBlockClientId,
		colorBlockAttributes,
		resolvedColorValue,
		setAttributes,
		themeColors,
		updateBlockAttributes,
	]);

	useEffect(() => {
		previousResolvedColorRef.current = resolvedColorValue;
	}, [resolvedColorValue]);

	useSyncedBlockAttribute({
		attributeName: "label",
		blockClientId: colorBlockClientId,
		currentValue: colorBlockLabel,
		nextValue: fallbackName,
		updateBlockAttributes,
	});

	useSyncedBlockAttribute({
		attributeName: "content",
		blockClientId: codeBlockClientId,
		currentValue: codeBlockContent,
		nextValue: colorCode,
		updateBlockAttributes,
	});
};
