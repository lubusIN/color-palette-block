/**
 * External Dependencies
 */
import React from 'react';
import { SketchPicker } from 'react-color';

/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const {
	IconButton,
	Dropdown,
} = wp.components;

// AddColor Component
const AddColorItem = ( props ) => {
	const onChangeColor = ( color ) => {
		props.onPickColor( color );
	};

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
				>
					{ !! props.actionText && __( 'Add Color' ) }
				</IconButton>
			) }
			renderContent={ () => (
				<div>
					<SketchPicker
						color={ props.color }
						onChange={ onChangeColor }
					/>

					<IconButton
						icon="admin-appearance"
						onClick={ props.onAddColor }
						label={ __( 'Add Color' ) }
						className="blocks-color-item__add-color"
					>
						Add Color
					</IconButton>
				</div>
			) }
		/>
	);
};

export default AddColorItem;
