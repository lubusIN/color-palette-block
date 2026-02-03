/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls, BlockControls } from '@wordpress/block-editor';

/**
 * WordPress dependencies
 */
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	ToggleControl,
	Button,
	ColorPicker,
	TextControl,
	Popover,
	ToolbarGroup,
	ToolbarButton,
	Placeholder,
	__experimentalConfirmDialog as ConfirmDialog
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { plus, trash, shuffle } from '@wordpress/icons';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import generateColorName from './utils/generateColorName';

/**
 * Custom SVG icon for the color palette block
 */
const ColorPaletteIcon = () => (
	<svg
		aria-hidden="true"
		role="img"
		focusable="false"
		width="20"
		height="20"
		viewBox="0 0 20 20"
	>
		<defs>
			<clipPath id="color-palette-clip">
				<path d="M0 0h20v20H0z" />
			</clipPath>
		</defs>
		<g strokeWidth=".208" clipPath="url(#color-palette-clip)">
			<path
				d="M3.333 15.833a.834.834 0 1 1 1.668.002.834.834 0 0 1-1.668-.002z"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M17.5 11.667h-3.042l2.292-2.292a2.49 2.49 0 0 0 0-3.5L14.167 3.25a2.49 2.49 0 0 0-3.5 0L8.333 5.542V2.5c0-1.375-1.125-2.5-2.5-2.5H2.5A2.507 2.507 0 0 0 0 2.5v15C0 18.875 1.125 20 2.5 20h15c1.375 0 2.5-1.125 2.5-2.5v-3.333c0-1.375-1.125-2.5-2.5-2.5zm-5.667-7.25a.887.887 0 0 1 1.167 0l2.625 2.625a.886.886 0 0 1 0 1.166l-7.292 7.209v-7.5l3.5-3.5zM6.625 17.625a.806.806 0 0 1-.792.708H2.5a.836.836 0 0 1-.833-.833v-15c0-.458.375-.833.833-.833h3.333c.459 0 .834.375.834.833v14.75l-.042.375zm11.708-.125a.836.836 0 0 1-.833.833H8.167l.125-.5 4.5-4.5H17.5c.458 0 .833.375.833.834V17.5z"
				vectorEffect="non-scaling-stroke"
			/>
		</g>
	</svg>
);

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes, className }) {
	const {
		colors,
		showColorNames,
		showColorCodes
	} = attributes;

	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [editingColor, setEditingColor] = useState(null);
	const [newColor, setNewColor] = useState('#000000');
	const [newColorName, setNewColorName] = useState('');
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	const [hasUserTypedName, setHasUserTypedName] = useState(false);
	const [colorToDelete, setColorToDelete] = useState(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	// Extract display style from className
	const getDisplayStyle = () => {
		if (className && className.includes('is-style-')) {
			const styleMatch = className.match(/is-style-([a-z-]+)/);
			return styleMatch ? styleMatch[1] : 'default';
		}
		return 'default';
	};

	const displayStyle = getDisplayStyle();

	// Get theme colors from WordPress
	const { themeColors } = useSelect((select) => {
		const settings = select('core/block-editor').getSettings();
		return {
			themeColors: settings.colors || []
		};
	}, []);


	const generateRandomColor = () => {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	};

	const generateRandomPalette = () => {
		const randomColors = [];
		const paletteSize = Math.floor(Math.random() * 4) + 4; // 4-7 colors

		for (let i = 0; i < paletteSize; i++) {
			const randomColorHex = generateRandomColor();
			const randomColor = {
				id: `random-${Date.now()}-${i}`,
				color: randomColorHex,
				name: generateColorName(randomColorHex)
			};
			randomColors.push(randomColor);
		}

		setAttributes({
			colors: [...colors, ...randomColors]
		});
	};

	// Open popover for both toolbar and placeholder "Add Color" buttons
	const openAddColorPopover = (event) => {
		setPopoverAnchor(event.target);
		setEditingColor(null);
		const initialColor = '#000000';
		setNewColor(initialColor);
		// For new colors, start with generated name and mark as not user-typed
		setNewColorName(generateColorName(initialColor));
		setHasUserTypedName(false);
		setIsPopoverOpen(true);
	};

	const addColor = () => {
		const colorName = newColorName || generateColorName(newColor);
		const colorObject = {
			id: Date.now().toString(),
			color: newColor,
			name: colorName
		};
		setAttributes({
			colors: [...colors, colorObject]
		});
		setNewColor('#000000');
		setNewColorName('');
		setHasUserTypedName(false);
		setIsPopoverOpen(false);
	};

	const addThemeColors = () => {
		const newThemeColors = themeColors.map(themeColor => ({
			id: `theme-${themeColor.slug}-${Date.now()}-${Math.random()}`,
			color: themeColor.color,
			name: themeColor.name || themeColor.slug || generateColorName(themeColor.color)
		}));

		setAttributes({
			colors: [...colors, ...newThemeColors]
		});
	};

	const updateColor = (id, updates) => {
		setAttributes({
			colors: colors.map(colorItem =>
				colorItem.id === id ? { ...colorItem, ...updates } : colorItem
			)
		});
	};

	const removeColor = (id) => {
		setAttributes({
			colors: colors.filter(colorItem => colorItem.id !== id)
		});
		setShowDeleteConfirm(false);
		setColorToDelete(null);
	};

	const handleDeleteColor = (colorItem, event) => {
		event.stopPropagation();
		setColorToDelete(colorItem);
		setShowDeleteConfirm(true);
	};

	const confirmDelete = () => {
		if (colorToDelete) {
			removeColor(colorToDelete.id);
		}
	};

	const cancelDelete = () => {
		setShowDeleteConfirm(false);
		setColorToDelete(null);
	};

	const openEditPopover = (colorItem, event) => {
		setPopoverAnchor(event.target);
		setEditingColor(colorItem);
		setNewColor(colorItem.color);
		setNewColorName(colorItem.name);
		setHasUserTypedName(true); // Assume user has typed name when editing
		setIsPopoverOpen(true);
	};

	const updateEditingColor = () => {
		const colorName = newColorName || generateColorName(newColor);
		updateColor(editingColor.id, {
			color: newColor,
			name: colorName
		});
		setEditingColor(null);
		setNewColor('#000000');
		setNewColorName('');
		setHasUserTypedName(false);
		setIsPopoverOpen(false);
	};

	const closePopover = () => {
		setIsPopoverOpen(false);
		setEditingColor(null);
		setNewColor('#000000');
		setNewColorName('');
		setHasUserTypedName(false);
		setPopoverAnchor(null);
	};

	// Handle color picker change with better color extraction
	const handleColorChange = (color) => {
		// Extract hex color from various possible formats
		let hexColor;
		if (typeof color === 'string') {
			hexColor = color.startsWith('#') ? color : `#${color}`;
		} else if (color && typeof color === 'object') {
			// Handle different color object formats
			if (color.hex) {
				hexColor = color.hex;
			} else if (color.color) {
				hexColor = color.color;
			} else if (color.r !== undefined && color.g !== undefined && color.b !== undefined) {
				// Convert RGB to hex
				const toHex = (n) => {
					const hex = Math.round(n).toString(16);
					return hex.length === 1 ? '0' + hex : hex;
				};
				hexColor = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
			} else {
				// Fallback to current color if we can't parse
				hexColor = newColor;
			}
		} else {
			// Fallback to current color
			hexColor = newColor;
		}

		setNewColor(hexColor);

		// Auto-generate name only when adding new color AND user hasn't typed a custom name
		if (!editingColor && !hasUserTypedName) {
			const generatedName = generateColorName(hexColor);
			setNewColorName(generatedName);
		}
	};

	// Handle name input change
	const handleNameChange = (value) => {
		setNewColorName(value);
		// Mark as user-typed once they start typing (even if they clear it)
		if (!hasUserTypedName && value !== '') {
			setHasUserTypedName(true);
		}
	};

	const renderColorItem = (colorItem, index) => {
		// Add safety checks to prevent undefined errors
		if (!colorItem || !colorItem.color) {
			return null;
		}

		const colorClasses = `color-item color-item--${displayStyle}`;

		return (
			<div
				key={colorItem.id}
				className={colorClasses}
			>
				{displayStyle === 'polaroid' ? (
					<div className="color-frame">
						<div className="color-swatch-wrapper">
							<div
								className="color-swatch"
								style={{ backgroundColor: colorItem.color }}
								onClick={(event) => openEditPopover(colorItem, event)}
							>
							</div>
						</div>
					</div>
				) : (
					<div
						className="color-swatch"
						style={{ backgroundColor: colorItem.color }}
						onClick={(event) => openEditPopover(colorItem, event)}
					>
					</div>
				)}
				{showColorNames && (
					<div className="color-name">{colorItem.name || 'Untitled'}</div>
				)}
				{showColorCodes && (
					<div className="color-code">{colorItem.color ? colorItem.color.toUpperCase() : ''}</div>
				)}

				{/* Delete button */}
				<Button
					icon={trash}
					label={__('Remove color', 'color-palette-block-wp')}
					className="remove-color-btn"
					onClick={(event) => handleDeleteColor(colorItem, event)}
					isDestructive
				/>
			</div>
		);
	};

	const renderAddColorPlaceholder = () => {
		const colorClasses = `color-item color-item--${displayStyle} color-item--add`;

		return (
			<div
				key="add-color-placeholder"
				className={colorClasses}
				onClick={openAddColorPopover}
			>
				{displayStyle === 'polaroid' ? (
					<>
						<div className="color-frame color-frame--add">
							<div className="color-swatch-wrapper color-swatch-wrapper--add">
								<div className="color-swatch color-swatch--add">
									<div className="add-color-icon">
										{plus}
									</div>
								</div>
							</div>
						</div>
						{(showColorNames || showColorCodes) && (
							<div className="add-color-label">
								{__('Add Color', 'color-palette-block-wp')}
							</div>
						)}
					</>
				) : (
					<>
						<div className="color-swatch color-swatch--add">
							<div className="add-color-icon">
								{plus}
							</div>
						</div>
						{(showColorNames || showColorCodes) && (
							<div className="add-color-label">
								{__('Add Color', 'color-palette-block-wp')}
							</div>
						)}
					</>
				)}
			</div>
		);
	};

	const blockProps = useBlockProps();

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={plus}
						label={__('Add Color', 'color-palette-block-wp')}
						onClick={openAddColorPopover}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<ToolsPanel
					label={__('Display', 'color-palette-block-wp')}
					resetAll={() => {
						setAttributes({
							showColorNames: true,
							showColorCodes: true
						});
					}}
				>
					<ToolsPanelItem
						hasValue={() => !showColorNames}
						label={__('Name', 'color-palette-block-wp')}
						onDeselect={() => setAttributes({ showColorNames: true })}
						isShownByDefault
					>
						<ToggleControl
							label={__('Name', 'color-palette-block-wp')}
							checked={showColorNames}
							onChange={(value) => setAttributes({ showColorNames: value })}
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						hasValue={() => !showColorCodes}
						label={__('Code', 'color-palette-block-wp')}
						onDeselect={() => setAttributes({ showColorCodes: true })}
						isShownByDefault
					>
						<ToggleControl
							label={__('Code', 'color-palette-block-wp')}
							checked={showColorCodes}
							onChange={(value) => setAttributes({ showColorCodes: value })}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div {...blockProps}>
				<div className={`color-palette color-palette--${displayStyle}`}>
					{colors && colors.length > 0 ? (
						<div className="color-grid">
							{colors.map((colorItem, index) => renderColorItem(colorItem, index))}
							{renderAddColorPlaceholder()}
						</div>
					) : (
						<Placeholder
							icon={<ColorPaletteIcon />}
							label={__('Color Palette', 'color-palette-block-wp')}
							instructions={__('Start building your color palette by adding your first color.', 'color-palette-block-wp')}
						>
							{themeColors && themeColors.length > 0 && (
								<Button
									isPrimary
									onClick={addThemeColors}
								>
									{__('Theme Colors', 'color-palette-block-wp')}
								</Button>
							)}
							<Button
								isPrimary={!themeColors || themeColors.length === 0}
								isSecondary={themeColors && themeColors.length > 0}
								onClick={generateRandomPalette}
							>
								{__('Surprise Me', 'color-palette-block-wp')}
							</Button>
							<Button
								isSecondary
								onClick={openAddColorPopover}
							>
								{__('Add Color', 'color-palette-block-wp')}
							</Button>
						</Placeholder>
					)}
				</div>
			</div>

			{/* Popover for all color adding and editing */}
			{isPopoverOpen && popoverAnchor && (
				<Popover
					anchor={popoverAnchor}
					placement="bottom-start"
					onClose={closePopover}
					resize={false}
					noArrow={false}
				>
					<div className="color-picker-popover">
						<div className="color-picker-popover__content">
							<ColorPicker
								color={newColor}
								onChange={handleColorChange}
								enableAlpha={false}
							/>
							<TextControl
								label={__('Name', 'color-palette-block-wp')}
								value={newColorName}
								onChange={handleNameChange}
								placeholder={generateColorName(newColor)}
							/>
						</div>
						<div className="color-picker-popover__actions">
							<Button
								isPrimary
								onClick={editingColor ? updateEditingColor : addColor}
							>
								{editingColor ? __('Update', 'color-palette-block-wp') : __('Add', 'color-palette-block-wp')}
							</Button>
							<Button
								isSecondary
								onClick={closePopover}
							>
								{__('Cancel', 'color-palette-block-wp')}
							</Button>
						</div>
					</div>
				</Popover>
			)}

			{/* Delete confirmation dialog */}
			<ConfirmDialog
				isOpen={showDeleteConfirm}
				onConfirm={confirmDelete}
				onCancel={cancelDelete}
				confirmButtonText={__('Delete', 'color-palette-block-wp')}
				cancelButtonText={__('Cancel', 'color-palette-block-wp')}
				isDestructive
			>
				{colorToDelete && (
					<p>
						{__('Are you sure you want to delete', 'color-palette-block-wp')}
						<strong> "{colorToDelete.name || colorToDelete.color}"</strong>?
					</p>
				)}
			</ConfirmDialog>
		</>
	);
}
