/**
 * External Dependencies
 */
import { filter } from 'lodash';

/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
	Placeholder,
} = wp.components;

/**
 * Internal Dependencies
 */
import AddColorItem from '../components/add-color-item';
import ColorItem from '../components/color-item';

// Color Editor
class ColorEditor extends Component {
	constructor( ) {
		super( ...arguments );
		this.onAddColor = this.onAddColor.bind( this );
		this.onSelectColor = this.onSelectColor.bind( this );
		this.onRemoveColor = this.onRemoveColor.bind( this );
		this.onPickColor = this.onPickColor.bind( this );

		//this.props.attributes.colors = [];
		this.state = {
			selectedColor: null,
			pickedColor: '#22194D',
		};
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
		const newColor = this.state.pickedColor;
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
		return () => {
			const colors = filter( this.props.attributes.colors, ( color, i ) => index !== i );
			this.setState( { selectedColor: null } );
			this.props.setAttributes( {
				colors,
			} );
		};
	}

	onPickColor( color ) {
		this.setState( {
			pickedColor: color.hex,
		} );
	}

	render() {
		const { attributes, isSelected } = this.props;

		if ( attributes.colors.length === 0 ) {
			return (
				<Placeholder key="cpb-placeholder"
					icon="admin-appearance"
					label={ __( 'Colors' ) }
					instructions={ __( 'Add colors to create your palette' ) }
				>
					<AddColorItem
						color={ this.state.pickedColor }
						onAddColor={ this.onAddColor }
						onPickColor={ this.onPickColor }
						actionText
					/>
				</Placeholder>
			);
		}

		return (
			<ul key="color-palette" className={ `${ this.props.className } cpb-colors` }>
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
					<AddColorItem
						color={ this.state.pickedColor }
						onAddColor={ this.onAddColor }
						onPickColor={ this.onPickColor }
					/>
				</li>
				}
			</ul>
		);
	}
}

export default ColorEditor;
