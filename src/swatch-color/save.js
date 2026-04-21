/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";

/**
 * Internal dependencies
 */
import { resolveSwatchColorValue } from "../utils/swatchColor";
import { getSwatchTriggerProps } from "../utils/swatchTrigger";

/**
 * Save component for the swatch color preview block.
 *
 * @param {Object} props            Save props.
 * @param {Object} props.attributes Swatch color attributes.
 * @return {JSX.Element} Saved markup.
 */
export default function SwatchColorSave({ attributes }) {
	const { label } = attributes;
	const colorValue = resolveSwatchColorValue(attributes) || "#000000";

	return (
		<div
			{...useBlockProps.save({
				className: "color-swatch",
				...getSwatchTriggerProps({
					accessibleLabel: label,
					colorName: label || "",
					colorValue,
				}),
			})}
		/>
	);
}
