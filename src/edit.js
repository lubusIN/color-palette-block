/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __, sprintf } from '@wordpress/i18n';

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
import { plus, trash } from '@wordpress/icons';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import generateColorName from './utils/generateColorName';
import getDisplayStyle from './utils/getDisplayStyle';
import ColorPaletteIcon from './icon';

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

	const paletteColors = Array.isArray(colors) ? colors : [];
	const displayStyle = getDisplayStyle(className);

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
			colors: [...paletteColors, ...randomColors]
		});
	};

	// Open popover for both toolbar and placeholder "Add Color" buttons
	const openAddColorPopover = (event) => {
		const anchor = event?.currentTarget || event?.target || null;
		setPopoverAnchor(anchor);
		setEditingColor(null);
		const initialColor = '#000000';
		setNewColor(initialColor);
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
			colors: [...paletteColors, colorObject]
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
			colors: [...paletteColors, ...newThemeColors]
		});
	};

	const updateColor = (id, updates) => {
		setAttributes({
			colors: paletteColors.map(colorItem =>
				colorItem.id === id ? { ...colorItem, ...updates } : colorItem
			)
		});
	};

	const removeColor = (id) => {
		setAttributes({
			colors: paletteColors.filter(colorItem => colorItem.id !== id)
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
		const anchor = event?.currentTarget || event?.target || null;
		setPopoverAnchor(anchor);
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
		const colorCode = colorItem.color ? colorItem.color.toUpperCase() : '';
		const fallbackName = colorItem.name || __('Untitled', 'color-palette-block-wp');
		const swatchAriaLabel = sprintf(
			__('Edit color %s', 'color-palette-block-wp'),
			fallbackName
		);
		const handleSwatchKeyDown = (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				openEditPopover(colorItem, event);
			}
		};
		const swatchProps = {
			className: 'color-swatch',
			style: { backgroundColor: colorItem.color },
			role: 'button',
			tabIndex: 0,
			'aria-label': swatchAriaLabel,
			onClick: (event) => openEditPopover(colorItem, event),
			onKeyDown: handleSwatchKeyDown
		};

		return (
			<div
				key={colorItem.id}
				className={colorClasses}
			>
				{displayStyle === 'polaroid' ? (
					<div className="color-frame">
						<div className="color-swatch-wrapper">
							<div
								{...swatchProps}
							>
							</div>
						</div>
					</div>
				) : (
					<div
						{...swatchProps}
					>
					</div>
				)}
				{showColorNames && (
					<div className="color-name">{fallbackName}</div>
				)}
				{showColorCodes && (
					<div className="color-code">{colorCode}</div>
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
		const placeholderLabel = __('Add Color', 'color-palette-block-wp');
		const handleKeyDown = (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				openAddColorPopover(event);
			}
		};

		return (
			<div
				key="add-color-placeholder"
				className={colorClasses}
				onClick={openAddColorPopover}
				role="button"
				tabIndex={0}
				aria-label={placeholderLabel}
				onKeyDown={handleKeyDown}
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
					{paletteColors.length > 0 ? (
						<div className="color-grid">
							{paletteColors.map((colorItem, index) => renderColorItem(colorItem, index))}
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
									variant="primary"
									onClick={addThemeColors}
								>
									{__('Theme Colors', 'color-palette-block-wp')}
								</Button>
							)}
							<Button
								variant={!themeColors || themeColors.length === 0 ? 'primary' : 'secondary'}
								onClick={generateRandomPalette}
							>
								{__('Surprise Me', 'color-palette-block-wp')}
							</Button>
							<Button
								variant="secondary"
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
								variant="primary"
								onClick={editingColor ? updateEditingColor : addColor}
							>
								{editingColor ? __('Update', 'color-palette-block-wp') : __('Add', 'color-palette-block-wp')}
							</Button>
							<Button
								variant="secondary"
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
						{sprintf(
							__('Are you sure you want to delete "%s"?', 'color-palette-block-wp'),
							colorToDelete.name || colorToDelete.color || __('this color', 'color-palette-block-wp')
						)}
					</p>
				)}
			</ConfirmDialog>
		</>
	);
}
