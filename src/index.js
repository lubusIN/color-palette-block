/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Internal Dependencies
 */
import blockAttributes from './data/attributes';
import icons from './data/icons';
import ColorEditor from './block/editor';
import ColorPalette from './block/render';
import './style.scss';

/**
 * Register Color Palette Block
 */
registerBlockType( 'lubus/color-palette-block', {
	title: __( 'Color Palette' ),
	icon: icons.logo,
	category: 'layout',
	attributes: blockAttributes,
	edit: ColorEditor,
	save: ColorPalette,
} );
