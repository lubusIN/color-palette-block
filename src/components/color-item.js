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

		this.onColorClick = this.onColorClick.bind( this );
	}

	onColorClick() {
		if ( ! this.props.isSelected ) {
			this.props.onSelect();
		}
	}

	render() {
		return (
			<li
				className={ `cpb-${ this.props.displayStyle } ${ classnames( { 'is-Selected': this.props.isSelected } ) }` }
				onClick={ this.onColorClick }>

				{ this.props.isSelected &&
					<div className="blocks-color-item__inline-menu">
						<IconButton
							icon="no-alt"
							onClick={ this.props.onRemove }
							className="blocks-color-item__remove"
							label={ __( 'Remove Color' ) }
						/>
					</div>
				}

				<span className="cpb-color" style={ { backgroundColor: this.props.code } }></span>
				<span className="cpb-code">{ this.props.code }</span>
			</li>
		);
	}
}

export default ColorItem;
