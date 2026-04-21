/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	BlockControls,
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from "@wordpress/block-editor";
import {
	Button,
	PanelBody,
	Placeholder,
	RangeControl,
	ToolbarGroup,
	ToolbarButton,
} from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { plus } from "@wordpress/icons";

/**
 * Internal dependencies
 */
import "./editor.scss";
import getDisplayStyle from "./utils/getDisplayStyle";
import getSwatchSizeStyle from "./utils/swatchSize";
import ColorPaletteIcon from "./icon";
import {
	createSwatchBlock,
	SWATCH_BLOCK_NAME,
} from "./utils/createSwatchBlocks";
import generateColorName from "./utils/generateColorName";

const ALLOWED_BLOCKS = [SWATCH_BLOCK_NAME];
const DEFAULT_SWATCH_SIZE = 100;
const MIN_SWATCH_SIZE = 60;
const MAX_SWATCH_SIZE = 240;

/**
 * Generates a random hex color for the palette starter actions.
 *
 * @return {string} Random hex color.
 */
const generateRandomColor = () => {
	const letters = "0123456789ABCDEF";
	let color = "#";

	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}

	return color;
};

/**
 * Editor component for the parent color palette block.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Current block attributes.
 * @param {string}   props.clientId      Current block client id.
 * @param {string}   props.className     Wrapper class name from Gutenberg.
 * @param {Function} props.setAttributes Attribute updater.
 * @return {JSX.Element} Editor markup.
 */
export default function Edit({
	attributes,
	clientId,
	className,
	setAttributes,
}) {
	const { swatchSize } = attributes;
	const displayStyle = getDisplayStyle(className);
	const blockProps = useBlockProps({ style: getSwatchSizeStyle(swatchSize) });

	const { innerBlockCount, themeColors } = useSelect(
		(select) => {
			const blockEditor = select("core/block-editor");
			const settings = blockEditor.getSettings();

			return {
				innerBlockCount: blockEditor.getBlockOrder(clientId).length,
				themeColors: settings.colors || [],
			};
		},
		[clientId],
	);

	const { insertBlocks } = useDispatch("core/block-editor");

	const insertSwatches = (blocks) => {
		if (!blocks.length) {
			return;
		}

		insertBlocks(blocks, innerBlockCount, clientId);
	};

	const addSingleSwatch = () => {
		insertSwatches([createSwatchBlock()]);
	};

	const addThemeColors = () => {
		insertSwatches(
			themeColors.map((themeColor) =>
				createSwatchBlock({
					color: themeColor.color,
					name:
						themeColor.name ||
						themeColor.slug ||
						generateColorName(themeColor.color),
				}),
			),
		);
	};

	const addRandomPalette = () => {
		const randomCount = Math.floor(Math.random() * 4) + 4;
		const randomSwatches = Array.from({ length: randomCount }, () => {
			const color = generateRandomColor();

			return createSwatchBlock({
				color,
				name: generateColorName(color),
			});
		});

		insertSwatches(randomSwatches);
	};

	const innerBlocksProps = useInnerBlocksProps(
		{ className: "color-grid" },
		{
			allowedBlocks: ALLOWED_BLOCKS,
			orientation: "horizontal",
			renderAppender: InnerBlocks.ButtonBlockAppender,
		},
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Swatch Size", "color-palette-block-wp")}>
					<RangeControl
						label={__("Size", "color-palette-block-wp")}
						value={swatchSize || DEFAULT_SWATCH_SIZE}
						onChange={(nextSize) =>
							setAttributes({
								swatchSize: Number.isFinite(nextSize) ? nextSize : undefined,
							})
						}
						onReset={() => setAttributes({ swatchSize: undefined })}
						min={MIN_SWATCH_SIZE}
						max={MAX_SWATCH_SIZE}
						step={4}
						allowReset
						resetFallbackValue={DEFAULT_SWATCH_SIZE}
					/>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={plus}
						label={__("Add swatch", "color-palette-block-wp")}
						onClick={addSingleSwatch}
					/>
				</ToolbarGroup>
			</BlockControls>

			<div {...blockProps}>
				<div className={`color-palette color-palette--${displayStyle}`}>
					{innerBlockCount > 0 ? (
						<div {...innerBlocksProps} />
					) : (
						<Placeholder
							icon={<ColorPaletteIcon />}
							label={__("Color Palette", "color-palette-block-wp")}
							instructions={__(
								"Add swatches, import theme colors, or generate a random palette.",
								"color-palette-block-wp",
							)}
						>
							{themeColors.length > 0 && (
								<Button variant="primary" onClick={addThemeColors}>
									{__("Theme Colors", "color-palette-block-wp")}
								</Button>
							)}
							<Button
								variant={themeColors.length > 0 ? "secondary" : "primary"}
								onClick={addRandomPalette}
							>
								{__("Surprise Me", "color-palette-block-wp")}
							</Button>
							<Button variant="secondary" onClick={addSingleSwatch}>
								{__("Add Swatch", "color-palette-block-wp")}
							</Button>
							{/* Keep the inner blocks mount available so placeholder actions can insert the first swatch. */}
							<div {...innerBlocksProps} style={{ display: "none" }} />
						</Placeholder>
					)}
				</div>
			</div>
		</>
	);
}
