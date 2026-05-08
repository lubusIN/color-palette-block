/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";

/**
 * Editor component for the swatch name block.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Swatch name attributes.
 * @param {Function} props.setAttributes Attribute updater.
 * @return {JSX.Element} Editor markup.
 */
export default function SwatchNameEdit({ attributes, setAttributes }) {
	const { content } = attributes;

	return (
		<RichText
			{...useBlockProps({
				className: "color-name",
			})}
			tagName="div"
			value={content}
			allowedFormats={[]}
			placeholder={__("Color name", "blablablocks-color-palette-block")}
			onChange={(value) => setAttributes({ content: value })}
		/>
	);
}
