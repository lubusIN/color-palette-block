/**
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { IconButton } = wp.components;

/**
 * ColorItem Component
 *
 * @param {object} props components props
 * @returns {jsx} react element
 */
const ColorItem = ( props ) => {
	// Component props
	const { isSelected, code, displayStyle, onSelect, onRemove } = props;

	// Event handler
	const onColorSelect = () => {
		if ( ! isSelected ) {
			onSelect();
		}
	};

	return (
		<li
			className={ `cpb-${ displayStyle } ${ classnames( { 'is-Selected': isSelected } ) }` }
			onClick={ onColorSelect } >

			{
				// Display remove color action if selected
				isSelected &&
				<div className="blocks-color-item__inline-menu">
					<IconButton
						icon="no-alt"
						onClick={ onRemove }
						className="blocks-color-item__remove"
						label={ __( 'Remove Color' ) }
					/>
				</div>
			}

			<span className="cpb-color" style={ { backgroundColor: code } }></span>
			<span className="cpb-code">{ code }</span>
		</li>
	);
};

export default ColorItem;
