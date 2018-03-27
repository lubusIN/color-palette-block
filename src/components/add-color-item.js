/**
 * External Dependencies
 */
import React from 'react';
import { SketchPicker as ColorPicker } from 'react-color';

/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const {
	IconButton,
	Dropdown,
} = wp.components;

/**
 * AddColorItem Component
 *
 * @param {object} props component props
 * @returns {jsx} react element
 */
const AddColorItem = ( props ) => {
	// Component props
	const { color, onPickColor, onAddColor } = props;

	// Event handler
	const onChangeColor = ( colorSelected ) => onPickColor( colorSelected );

	return (
		<Dropdown
			className="blocks-color-item__color-dropdown"
			contentClassName="block-color-item__color-popover"
			position="bottom right"
			headerTitle={ __( 'select Color' ) }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<IconButton
					onClick={ onToggle }
					aria-expanded={ isOpen }
					icon="insert"
					label={ __( 'Add Color' ) }
				/>
			) }
			renderContent={ ( { onClose } ) => {
				const onSelect = () => {
					onAddColor();
					onClose();
				};

				return (
					<div>
						<ColorPicker
							color={ color }
							onChange={ onChangeColor }
						/>

						<IconButton
							icon="admin-appearance"
							onClick={ onSelect }
							label={ __( 'Add Color' ) }
							className="blocks-color-item__add-color"
						>
							Add Color
						</IconButton>
					</div>
				);
			} }
		/>
	);
};

export default AddColorItem;
