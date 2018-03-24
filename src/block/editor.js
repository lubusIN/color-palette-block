/**
 * External Dependencies
 */
import { filter } from 'lodash';

/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { IconButton } = wp.components;

// Color Editor
class ColorEditor extends Component {
	constructor( ) {
		super( ...arguments );

		this.state = {
			selectedColor: null,
		};

		this.onAddColor = this.onAddColor.bind( this );
		this.onSelectColor = this.onSelectColor.bind( this );
		this.onRemoveColor = this.onRemoveColor.bind( this );
	}

	onAddColor() {
		const colors = this.props.attributes.colors;
		const newColor = '#' + Math.floor( Math.random() * 16777215 ).toString( 16 );
		const AddColor = {
			swatch: '',
			code: newColor,
		};

		colors.push( AddColor );
		this.props.setAttributes( {
			colors,
		} );
	}

	onSelectColor( index ) {
		return () => {
			if ( this.state.selectedColor !== index ) {
				this.setState( {
					selectedColor: index,
				} );
			}
		};
	}

	onRemoveColor( index ) {

	}

	render() {
		const { attributes, isSelected } = this.props;

		return <ul key="color-palette" className="cpb-colors">
			{
				attributes.colors.map( ( color, index ) => (
					<li onClick={ this.onSelectColor( index ) } key={ index } className={ `cpb-${ attributes.style }` }>
						<span className="cpb-color" style={ { backgroundColor: color.code } }></span>
						<span className="cpb-code">{ color.code }</span>
					</li>
				) )
			}

			{ isSelected &&
			<li className="cpb-add-color">
				<IconButton
					icon="insert"
					onClick={ this.onAddColor }
					label={ __( 'Add Color' ) }
				/>
			</li>
			}
		</ul>;
	}
}

export default ColorEditor;
