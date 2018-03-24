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

/**
 * Internal Dependencies
 */
import ColorItem from '../components/color-item';

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

	componentWillReceiveProps( nextProps ) {
		// Deselect color when deselecting the block
		if ( ! nextProps.isSelected && this.props.isSelected ) {
			this.setState( {
				selectedColor: null,
			} );
		}
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
		console.log( this.state.selectedColor );
		return () => {
			if ( this.state.selectedColor !== index ) {
				this.setState( {
					selectedColor: index,
				} );
			}
		};
	}

	onRemoveColor( index ) {
		return () => {
			const colors = filter( this.props.attributes.colors, ( color, i ) => index !== i );
			this.setState( { selectedColor: null } );
			this.props.setAttributes( {
				colors,
			} );
		};
	}

	render() {
		const { attributes, isSelected } = this.props;

		return <ul key="color-palette" className="cpb-colors">
			{
				attributes.colors.map( ( color, index ) => (
					<ColorItem
						key={ index }
						code={ color.code }
						displayStyle={ attributes.style }
						isSelected={ isSelected && this.state.selectedColor === index }
						onSelect={ this.onSelectColor( index ) }
						onRemove={ this.onRemoveColor( index ) }
					/>
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
