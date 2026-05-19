/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { createPortal } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import { getCardStyle, normalizeStyleGroups } from "../utils/colorStyles";
import { resolveSwatchColorValue } from "../utils/swatchColor";
import { selectSwatchEditorState } from "./selectors";
import { ALLOWED_BLOCKS, getSwatchLabel } from "./utils";
import { useSwatchChildSync } from "./useSwatchChildSync";
import { useSwatchSummaryPortal } from "./useSwatchSummaryPortal";
import { canSyncSwatchStyles, syncSwatchStylesToSiblings } from "./styleSync";

/**
 * Editor component for a single swatch and its locked child blocks.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Swatch attributes.
 * @param {string}   props.clientId      Swatch client id.
 * @param {boolean}  props.isSelected    Whether the swatch is selected.
 * @param {Function} props.setAttributes Swatch attribute updater.
 * @return {JSX.Element} Editor markup.
 */
export default function SwatchEdit({
	attributes,
	clientId,
	isSelected,
	setAttributes,
}) {
	const { color, name, styles } = attributes;

	const normalizedStyles = normalizeStyleGroups(styles);
	const cardStyle = getCardStyle(normalizedStyles.card);
	const blockProps = useBlockProps({
		className: "color-item",
		style: Object.keys(cardStyle).length > 0 ? cardStyle : undefined,
	});

	const {
		themeColors,
		nameBlockClientId,
		nameBlockContent,
		nameBlockAttributes,
		codeBlockClientId,
		codeBlockContent,
		codeBlockAttributes,
		colorBlockClientId,
		colorBlockAttributes,
		colorBlockLabel,
		siblingSwatches,
	} = useSelect(
		(select) => selectSwatchEditorState(select, clientId),
		[clientId],
	);
	const { insertBlocks, updateBlockAttributes } =
		useDispatch("core/block-editor");
	const { createSuccessNotice } = useDispatch("core/notices");
	const resolvedColorValue =
		resolveSwatchColorValue(colorBlockAttributes, themeColors) ||
		color ||
		"#000000";
	const colorCode = resolvedColorValue.toUpperCase();
	const fallbackName =
		name ||
		getSwatchLabel(colorBlockAttributes, resolvedColorValue, themeColors);
	const canSyncStyles = canSyncSwatchStyles({
		attributes,
		colorBlockAttributes,
		nameBlockAttributes,
		codeBlockAttributes,
		siblingSwatches,
	});
	const summaryPortalTarget = useSwatchSummaryPortal(isSelected);

	useSwatchChildSync({
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
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		templateLock: "insert",
		renderAppender: false,
	});

	const syncSwatchStyles = () => {
		syncSwatchStylesToSiblings({
			attributes,
			clientId,
			codeBlockAttributes,
			colorBlockAttributes,
			createSuccessNotice,
			nameBlockAttributes,
			siblingSwatches,
			updateBlockAttributes,
		});
	};

	return (
		<>
			{summaryPortalTarget &&
				createPortal(
					<div className="color-palette-swatch-summary-action__inner">
						<Button
							variant="secondary"
							onClick={syncSwatchStyles}
							disabled={!canSyncStyles}
						>
							{__("Sync styles to all swatches", "color-palette-block")}
						</Button>
					</div>,
					summaryPortalTarget,
				)}
			<div {...innerBlocksProps} />
		</>
	);
}
