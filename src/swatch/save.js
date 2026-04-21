/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

/**
 * Internal dependencies
 */
import { getCardStyle, normalizeStyleGroups } from "../utils/colorStyles";

/**
 * Save component for a single swatch wrapper and its locked child blocks.
 *
 * @param {Object} props            Save props.
 * @param {Object} props.attributes Swatch attributes.
 * @return {JSX.Element} Saved markup.
 */
export default function SwatchSave({ attributes }) {
	const { styles } = attributes;
	const normalizedStyles = normalizeStyleGroups(styles);
	const cardStyle = getCardStyle(normalizedStyles.card);
	const blockProps = useBlockProps.save({
		className: "color-item",
		style: Object.keys(cardStyle).length > 0 ? cardStyle : undefined,
	});
	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlocksProps} />;
}
