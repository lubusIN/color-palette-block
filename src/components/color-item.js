/**
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { IconButton } = wp.components;

const ColorItem = ( props ) => {
	const onColorClick = () => {
		if ( ! props.isSelected ) {
			props.onSelect();
		}
	};

	return (
		<li
			className={ `cpb-${ props.displayStyle } ${ classnames( { 'is-Selected': props.isSelected } ) }` }
			onClick={ onColorClick }>

			{ props.isSelected &&
			<div className="blocks-color-item__inline-menu">
				<IconButton
					icon="no-alt"
					onClick={ props.onRemove }
					className="blocks-color-item__remove"
					label={ __( 'Remove Color' ) }
				/>
			</div>
			}

			<span className="cpb-color" style={ { backgroundColor: props.code } }></span>
			<span className="cpb-code">{ props.code }</span>
		</li>
	);
};

export default ColorItem;
