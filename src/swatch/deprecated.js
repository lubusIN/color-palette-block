/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

/**
 * Internal dependencies
 */
import generateColorName from "../utils/generateColorName";
import {
	getCardStyle,
	getTypographyStyle,
	normalizeStyleGroups,
} from "../utils/colorStyles";
import {
	createSwatchColorBlock,
	createSwatchInnerBlocks,
	SWATCH_COLOR_BLOCK_NAME,
} from "../utils/createSwatchBlocks";
import { getSwatchTriggerProps } from "../utils/swatchTrigger";

/**
 * Attributes from the intermediate nested-swatch structure used before the
 * dedicated swatch-color child block became mandatory.
 */
const nestedSwatchAttributes = {
	color: {
		type: "string",
		default: "#000000",
	},
	name: {
		type: "string",
		default: "",
	},
	styles: {
		type: "object",
		default: {
			card: {
				backgroundColor: "",
				borderColor: "",
				borderWidth: "",
				borderRadius: "",
				padding: "",
			},
		},
	},
};

/**
 * Attributes from the earlier non-InnerBlocks swatch implementation.
 */
const deprecatedAttributes = {
	color: {
		type: "string",
		default: "#000000",
	},
	name: {
		type: "string",
		default: "",
	},
	showName: {
		type: "boolean",
		default: true,
	},
	showCode: {
		type: "boolean",
		default: true,
	},
	styles: {
		type: "object",
		default: {
			name: {
				color: "",
				fontSize: "",
			},
			code: {
				color: "",
				fontSize: "",
			},
			card: {
				backgroundColor: "",
				borderColor: "",
				borderWidth: "",
				borderRadius: "",
				padding: "",
			},
		},
	},
};

/**
 * Resolves a stable fallback name for deprecated swatches.
 *
 * @param {Object} attributes Deprecated swatch attributes.
 * @return {string} Swatch label.
 */
const getFallbackName = (attributes = {}) =>
	attributes.name || generateColorName(attributes.color || "#000000");

/**
 * Normalizes the deprecated swatch card style payload to the current card-only
 * shape stored on the parent swatch block.
 *
 * @param {Object} styles Deprecated style groups.
 * @return {Object} Current card style group.
 */
const getDeprecatedCardStyles = (styles = {}) =>
	normalizeStyleGroups(styles).card;

/**
 * Renders the deprecated swatch trigger used by previous save versions.
 *
 * @param {string} colorValue    Swatch color value.
 * @return {JSX.Element} Saved swatch trigger.
 */
const renderDeprecatedSwatch = (colorValue) => (
	<div className="color-swatch" style={{ backgroundColor: colorValue }} />
);

/**
 * Deprecated swatch definitions are ordered newest to oldest so Gutenberg can
 * match the closest compatible save structure first.
 */
const deprecated = [
	{
		attributes: nestedSwatchAttributes,
		migrate: (attributes, innerBlocks = []) => {
			const fallbackName = getFallbackName(attributes);
			const hasColorBlock = innerBlocks.some(
				(block) => block.name === SWATCH_COLOR_BLOCK_NAME,
			);
			const nextInnerBlocks = hasColorBlock
				? innerBlocks
				: [
						createSwatchColorBlock(fallbackName, attributes.color || "#000000"),
						...innerBlocks,
				  ];

			return [
				{
					color: attributes.color,
					name: fallbackName,
					styles: {
						card: getDeprecatedCardStyles(attributes.styles),
					},
				},
				nextInnerBlocks,
			];
		},
		save: ({ attributes }) => {
			const { color, name, styles } = attributes;
			const normalizedStyles = normalizeStyleGroups(styles);
			const cardStyle = getCardStyle(normalizedStyles.card);
			const colorValue = color || "#000000";
			const fallbackName = name || getFallbackName({ color: colorValue });
			const blockProps = useBlockProps.save({
				className: "color-item",
				style: Object.keys(cardStyle).length > 0 ? cardStyle : undefined,
				...getSwatchTriggerProps({
					accessibleLabel: fallbackName,
					colorName: fallbackName,
					colorValue,
				}),
			});
			const innerBlocksProps = useInnerBlocksProps.save({
				className: "color-swatch-meta",
			});

			return (
				<div {...blockProps}>
					{renderDeprecatedSwatch(colorValue, fallbackName)}
					<div {...innerBlocksProps} />
				</div>
			);
		},
	},
	{
		attributes: deprecatedAttributes,
		migrate: (attributes) => [
			{
				color: attributes.color,
				name: getFallbackName(attributes),
				styles: {
					card: getDeprecatedCardStyles(attributes.styles),
				},
			},
			createSwatchInnerBlocks(
				getFallbackName(attributes),
				attributes.color || "#000000",
			),
		],
		save: ({ attributes }) => {
			const { color, name, showName, showCode, styles } = attributes;
			const normalizedStyles = normalizeStyleGroups(styles);
			const cardStyle = getCardStyle(normalizedStyles.card);
			const nameStyle = getTypographyStyle(normalizedStyles.name);
			const codeStyle = getTypographyStyle(normalizedStyles.code);
			const colorValue = color || "#000000";
			const colorCode = colorValue.toUpperCase();
			const fallbackName = name || getFallbackName({ color: colorValue });

			return (
				<div
					{...useBlockProps.save({
						className: "color-item",
						style: Object.keys(cardStyle).length > 0 ? cardStyle : undefined,
						...getSwatchTriggerProps({
							accessibleLabel: fallbackName,
							colorName: fallbackName,
							colorValue,
						}),
					})}
				>
					{renderDeprecatedSwatch(colorValue, fallbackName)}
					{showName && (
						<div
							className="color-name"
							style={Object.keys(nameStyle).length > 0 ? nameStyle : undefined}
						>
							{fallbackName}
						</div>
					)}
					{showCode && (
						<div
							className="color-code"
							style={Object.keys(codeStyle).length > 0 ? codeStyle : undefined}
						>
							{colorCode}
						</div>
					)}
				</div>
			);
		},
	},
];

export default deprecated;
