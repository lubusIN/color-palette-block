/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";

/**
 * Save component for the swatch color preview block.
 *
 * @param {Object} props            Save props.
 * @param {Object} props.attributes Swatch color attributes.
 * @return {JSX.Element} Saved markup.
 */
export default function SwatchColorSave() {
	return (
		<div
			{...useBlockProps.save({
				className: "color-swatch",
			})}
		/>
	);
}
