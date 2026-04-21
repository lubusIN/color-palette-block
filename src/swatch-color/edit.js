/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";

/**
 * Editor component for the swatch color preview block.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Swatch color attributes.
 * @return {JSX.Element} Editor markup.
 */
export default function SwatchColorEdit({ attributes }) {
	const { label } = attributes;

	return (
		<div
			{...useBlockProps({
				className: "color-swatch",
				"aria-label": label || __("Color swatch", "color-palette-block-wp"),
			})}
		/>
	);
}
