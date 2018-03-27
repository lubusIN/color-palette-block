/**
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { IconButton } = wp.components;

/**
 * ColorItem Component
 */
class ColorItem extends Component {
	constructor() {
		super( ...arguments );

		this.onSelect = this.onSelect.bind( this );
	}

	onSelect() {
		if ( ! this.props.isSelected ) {
			this.props.onSelect();
		}
	}

	render() {
		const { isSelected, code, displayStyle, onRemove } = this.props;

		return (
			<li
				className={ `cpb-${ displayStyle } ${ classnames( { 'is-Selected': isSelected } ) }` }
				onClick={ this.onSelect } >

				{ isSelected &&
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
	}
}

export default ColorItem;
