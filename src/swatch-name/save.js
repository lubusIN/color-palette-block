/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";

/**
 * Save component for the swatch name block.
 *
 * @param {Object} props            Save props.
 * @param {Object} props.attributes Swatch name attributes.
 * @return {JSX.Element} Saved markup.
 */
export default function SwatchNameSave({ attributes }) {
	const { content } = attributes;

	return (
		<RichText.Content
			{...useBlockProps.save({
				className: "color-name",
			})}
			tagName="div"
			value={content}
		/>
	);
}
