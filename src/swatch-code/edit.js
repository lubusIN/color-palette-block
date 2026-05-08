/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";

/**
 * Editor component for the swatch code block.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Swatch code attributes.
 * @return {JSX.Element} Editor markup.
 */
export default function SwatchCodeEdit({ attributes }) {
	const { content } = attributes;

	return (
		<div
			{...useBlockProps({
				className: "color-code",
			})}
		>
			{content || "#000000"}
		</div>
	);
}
