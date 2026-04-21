/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";

/**
 * Save component for the swatch code block.
 *
 * @param {Object} props            Save props.
 * @param {Object} props.attributes Swatch code attributes.
 * @return {JSX.Element} Saved markup.
 */
export default function SwatchCodeSave({ attributes }) {
	const { content } = attributes;

	return (
		<div
			{...useBlockProps.save({
				className: "color-code",
			})}
		>
			{content || "#000000"}
		</div>
	);
}
