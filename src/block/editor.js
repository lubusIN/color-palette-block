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
import ColorItem from '../components/color-item';
import AddColorItem from '../components/add-color-item';

/**
 * Color Palette Editor UI Component
 */
class ColorEditor extends Component {
	constructor() {
		super( ...arguments );
		this.onAddColor = this.onAddColor.bind( this );
		this.onSelectColor = this.onSelectColor.bind( this );
		this.onRemoveColor = this.onRemoveColor.bind( this );
		this.onPickColor = this.onPickColor.bind( this );

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
		const { pickedColor } = this.state;
		const { attributes, setAttributes } = this.props;
		const { colors } = attributes;

		const newColor = {
			swatch: '',
			code: pickedColor,
		};

		setAttributes( {
			colors: colors.concat( newColor ),
		} );
	}

	onSelectColor( index ) {
		const { selectedColor } = this.state;

		if ( selectedColor !== index ) {
			this.setState( {
				selectedColor: index,
			} );
		}
	}

	onRemoveColor( index ) {
		const { attributes, setAttributes } = this.props;
		const { colors } = attributes;

		const finalColors = filter( colors, ( color, i ) => index !== i );

		this.setState( { selectedColor: null } );

		setAttributes( {
			colors: finalColors,
		} );
	}

	onPickColor( color ) {
		this.setState( {
			pickedColor: color.hex,
		} );
	}

	render() {
		const { selectedColor, pickedColor } = this.state;
		const { attributes, isSelected, className } = this.props;
		const { colors, style } = attributes;

		if ( colors.length === 0 ) {
			return (
				<Placeholder key="cpb-placeholder"
					icon="admin-appearance"
					label={ __( 'Colors' ) }
					instructions={ __( 'Add colors to create your palette' ) }
				>
					<AddColorItem
						color={ pickedColor }
						onAddColor={ this.onAddColor }
						onPickColor={ this.onPickColor }
					/>
				</Placeholder>
			);
		}

		return (
			<ul key="cpb-colors" className={ `${ className } cpb-colors` }>
				{
					colors.map( ( color, index ) => (
						<ColorItem
							key={ index }
							code={ color.code }
							displayStyle={ style }
							isSelected={ isSelected && selectedColor === index }
							onSelect={ ( e ) => this.onSelectColor( index, e ) }
							onRemove={ ( e ) => this.onRemoveColor( index, e ) }
						/>
					) )
				}

				{ isSelected &&
				<li className="cpb-add-color">
					<AddColorItem
						color={ pickedColor }
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
