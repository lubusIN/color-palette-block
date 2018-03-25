/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Internal Dependencies
 */
import ColorEditor from './block/editor';
import './style.scss';

// Register Block
registerBlockType( 'lubus/color-palette-block', {
	title: __( 'Color Palette' ),
	icon: 'admin-appearance',
	category: 'layout',
	attributes: {
		colors: {
			type: 'array',
			source: 'query',
			default: [],
			selector: 'ul.cpb-colors li',
			query: {
				swatch: {
					selector: 'span.cpb-color',
					source: 'text',
				},
				code: {
					selector: 'span.cpb-code',
					source: 'text',
				},
			},
		},
		style: {
			type: 'string',
			default: 'card',
		},
	},
	edit: ColorEditor,
	save( props ) {
		return <ul className="cpb-colors">
			{
				props.attributes.colors.map( ( color, index ) => (
					<li key={ index } className={ `cpb-${ props.attributes.style }` }>
						<span className="cpb-color" style={ { backgroundColor: color.code } }></span>
						<span className="cpb-code">{ color.code }</span>
					</li>
				) )
			}
		</ul>;
	},
} );
