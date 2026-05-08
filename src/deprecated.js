/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";

/**
 * Internal dependencies
 */
import generateColorName from "./utils/generateColorName";
import getDisplayStyle from "./utils/getDisplayStyle";
import getSwatchSizeStyle from "./utils/swatchSize";
import { createSwatchBlocksFromColors } from "./utils/createSwatchBlocks";
import { getSwatchTriggerProps } from "./utils/swatchTrigger";
import {
	COPY_BUTTON_FORMATS,
	DEFAULT_INTERACTIVITY_CONTEXT,
} from "./utils/interactivity";
import {
	getCardStyle,
	getTypographyStyle,
	mergeStyleGroups,
	normalizeStyleGroups,
} from "./utils/colorStyles";

/**
 * Attributes used by the static wrapper implementation immediately before the
 * parent block moved to server rendering.
 */
const innerBlocksAttributes = {
	swatchSize: {
		type: "number",
	},
};

/**
 * Attributes used by the first dynamic parent implementation that saved only
 * raw inner blocks without the layout wrapper.
 */
const minimalInnerBlocksAttributes = {
	swatchSize: {
		type: "number",
	},
};

/**
 * Deprecated attributes used by the previous array-based implementation before
 * the block moved to the InnerBlocks swatch architecture.
 */
const currentAttributes = {
	colors: {
		type: "array",
		default: [],
	},
	showColorNames: {
		type: "boolean",
		default: true,
	},
	showColorCodes: {
		type: "boolean",
		default: true,
	},
	paletteStyles: {
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
				borderColor: "",
				borderWidth: "",
				borderRadius: "",
				padding: "",
			},
		},
	},
};

/**
 * Legacy attributes for the earliest saved markup format that queried color
 * data directly from the static HTML structure.
 */
const legacyAttributes = {
	colors: {
		type: "array",
		source: "query",
		default: [],
		selector: "ul.wp-block-blablablocks-color-palette li",
		query: {
			swatch: {
				selector: "span.cpb-color",
				source: "text",
				default: "",
			},
			code: {
				selector: "span.cpb-code",
				source: "text",
				default: "",
			},
		},
	},
	className: {
		type: "string",
	},
};

/**
 * Normalizes older saved palette markup into the color-item shape consumed by
 * the latest migration helpers.
 *
 * @param {Array} legacyColors Legacy query-sourced colors.
 * @return {Array} Normalized color items.
 */
const mapLegacyColors = (legacyColors = []) =>
	legacyColors
		.filter((color) => color && (color.code || color.swatch))
		.map((color, index) => {
			const rawCode = (color.code || color.swatch || "").trim();
			const normalizedCode = rawCode.startsWith("#")
				? rawCode
				: `#${rawCode.replace(/^#/, "")}`;

			return {
				id: color.id ? String(color.id) : `legacy-color-${index}`,
				color: normalizedCode || "#000000",
				name:
					(color.swatch || "").trim() ||
					generateColorName(normalizedCode || "#000000"),
			};
		});

/**
 * Renders the shared color copy buttons used by deprecated save output.
 *
 * @return {JSX.Element[]} Popover button elements.
 */
const renderCopyButtons = () =>
	COPY_BUTTON_FORMATS.map((format) => {
		const formatLabel = format.toUpperCase();
		const formatName = `${formatLabel.charAt(0)}${formatLabel
			.slice(1)
			.toLowerCase()}`;

		return (
			<button
				key={format}
				className="copy-btn"
				data-format={format}
				data-wp-on--click="actions.copyColor"
				data-wp-class--copied={`state.is${formatName}Copied`}
				data-wp-class--failed={`state.is${formatName}Failed`}
				data-wp-text={`state.${format}ButtonText`}
			>
				{formatLabel}
			</button>
		);
	});

/**
 * Renders the previous InnerBlocks wrapper markup so existing saved content can
 * validate before the block re-saves with dynamic rendering.
 *
 * @param {Object} attributes Previous block attributes.
 * @param {string} className  Saved wrapper class name.
 * @return {JSX.Element} Deprecated save markup.
 */
const renderInnerBlocksPalette = (attributes, className) => {
	const { swatchSize } = attributes;
	const displayStyle = getDisplayStyle(className);

	return (
		<div
			{...useBlockProps.save({
				style: getSwatchSizeStyle(swatchSize),
				"data-wp-interactive": "blablablocks/color-palette",
				"data-wp-context": JSON.stringify(DEFAULT_INTERACTIVITY_CONTEXT),
			})}
		>
			<div className={`color-palette color-palette--${displayStyle}`}>
				<div className="color-palette__items">
					<InnerBlocks.Content />
				</div>
			</div>
			<div
				className="color-copy-popover"
				data-wp-class--is-open="context.isPopoverOpen"
				data-wp-style--top="context.popoverTop"
				data-wp-style--left="context.popoverLeft"
				data-wp-on--mouseenter="actions.cancelCloseTimer"
				data-wp-on--mouseleave="actions.closePopover"
				data-wp-on--focusin="actions.cancelCloseTimer"
				data-wp-on--focusout="actions.startCloseTimer"
			>
				{renderCopyButtons()}
			</div>
		</div>
	);
};

/**
 * Renders the previous array-based palette markup so deprecated entries can
 * still validate and migrate cleanly.
 *
 * @param {Object} attributes Deprecated block attributes.
 * @param {string} className  Saved wrapper class name.
 * @return {JSX.Element} Deprecated save markup.
 */
const renderArrayPalette = (attributes, className) => {
	const {
		colors = [],
		showColorNames = true,
		showColorCodes = true,
		paletteStyles = {},
	} = attributes;
	const normalizedDefaults = normalizeStyleGroups(paletteStyles);
	const displayStyle = getDisplayStyle(className);

	const renderColorItem = (color) => {
		if (!color || !color.color) {
			return null;
		}

		const mergedStyles = mergeStyleGroups(
			normalizedDefaults,
			color.styles || {},
		);
		const cardStyle = getCardStyle(mergedStyles.card);
		const nameStyle = getTypographyStyle(mergedStyles.name);
		const codeStyle = getTypographyStyle(mergedStyles.code);
		const fallbackName = color.name || __("Untitled", "blablablocks-color-palette-block");
		const colorCode = color.color.toUpperCase();

		return (
			<div
				key={color.id}
				{...getSwatchTriggerProps({
					accessibleLabel: fallbackName,
					colorName: fallbackName,
					colorValue: color.color,
				})}
				className={`color-item color-item--${displayStyle}`}
				style={Object.keys(cardStyle).length > 0 ? cardStyle : undefined}
			>
				<div
					className="color-swatch"
					style={{ backgroundColor: color.color }}
				/>
				{showColorNames && (
					<div
						className="color-name"
						style={Object.keys(nameStyle).length > 0 ? nameStyle : undefined}
					>
						{fallbackName}
					</div>
				)}
				{showColorCodes && (
					<div
						className="color-code"
						style={Object.keys(codeStyle).length > 0 ? codeStyle : undefined}
					>
						{colorCode}
					</div>
				)}
			</div>
		);
	};

	return (
		<div
			{...useBlockProps.save({
				"data-wp-interactive": "blablablocks/color-palette",
				"data-wp-context": JSON.stringify(DEFAULT_INTERACTIVITY_CONTEXT),
			})}
		>
			<div className={`color-palette color-palette--${displayStyle}`}>
				<div className="color-palette__items">
					{colors.map(renderColorItem)}
				</div>
			</div>
			<div
				className="color-copy-popover"
				data-wp-class--is-open="context.isPopoverOpen"
				data-wp-style--top="context.popoverTop"
				data-wp-style--left="context.popoverLeft"
				data-wp-on--mouseenter="actions.cancelCloseTimer"
				data-wp-on--mouseleave="actions.closePopover"
				data-wp-on--focusin="actions.cancelCloseTimer"
				data-wp-on--focusout="actions.startCloseTimer"
			>
				{renderCopyButtons()}
			</div>
		</div>
	);
};

/**
 * Deprecated definitions are ordered newest to oldest so Gutenberg can match
 * the most recent compatible save shape first.
 */
const deprecated = [
	{
		attributes: minimalInnerBlocksAttributes,
		save: () => <InnerBlocks.Content />,
	},
	{
		attributes: innerBlocksAttributes,
		save: ({ attributes, className }) =>
			renderInnerBlocksPalette(attributes, className),
	},
	{
		attributes: currentAttributes,
		migrate: (attributes) => [
			{},
			createSwatchBlocksFromColors(attributes.colors, {
				showName: attributes.showColorNames,
				showCode: attributes.showColorCodes,
				defaultStyles: attributes.paletteStyles,
			}),
		],
		save: ({ attributes, className }) =>
			renderArrayPalette(attributes, className),
	},
	{
		attributes: legacyAttributes,
		migrate: (attributes) => [
			{},
			createSwatchBlocksFromColors(mapLegacyColors(attributes.colors)),
		],
		save: ({ attributes }) => {
			const { colors = [], className = "" } = attributes;

			return (
				<ul className={className}>
					{colors.map((color, index) => (
						<li key={index} className="cpb-card">
							<span
								className="cpb-color"
								style={{ backgroundColor: color.code }}
							/>
							<span className="cpb-code">{color.code}</span>
						</li>
					))}
				</ul>
			);
		},
	},
];

export default deprecated;
