/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Custom SVG icon for the color palette block
 */
const ColorPaletteIcon = () => (
	<svg 
		aria-hidden="true" 
		role="img" 
		focusable="false" 
		width="20" 
		height="20" 
		viewBox="0 0 20 20"
	>
		<defs>
			<clipPath id="color-palette-clip">
				<path d="M0 0h20v20H0z" />
			</clipPath>
		</defs>
		<g strokeWidth=".208" clipPath="url(#color-palette-clip)">
			<path 
				d="M3.333 15.833a.834.834 0 1 1 1.668.002.834.834 0 0 1-1.668-.002z" 
				vectorEffect="non-scaling-stroke" 
			/>
			<path 
				d="M17.5 11.667h-3.042l2.292-2.292a2.49 2.49 0 0 0 0-3.5L14.167 3.25a2.49 2.49 0 0 0-3.5 0L8.333 5.542V2.5c0-1.375-1.125-2.5-2.5-2.5H2.5A2.507 2.507 0 0 0 0 2.5v15C0 18.875 1.125 20 2.5 20h15c1.375 0 2.5-1.125 2.5-2.5v-3.333c0-1.375-1.125-2.5-2.5-2.5zm-5.667-7.25a.887.887 0 0 1 1.167 0l2.625 2.625a.886.886 0 0 1 0 1.166l-7.292 7.209v-7.5l3.5-3.5zM6.625 17.625a.806.806 0 0 1-.792.708H2.5a.836.836 0 0 1-.833-.833v-15c0-.458.375-.833.833-.833h3.333c.459 0 .834.375.834.833v14.75l-.042.375zm11.708-.125a.836.836 0 0 1-.833.833H8.167l.125-.5 4.5-4.5H17.5c.458 0 .833.375.833.834V17.5z" 
				vectorEffect="non-scaling-stroke" 
			/>
		</g>
	</svg>
);

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	/**
	 * Custom icon using JSX
	 */
	icon: ColorPaletteIcon,
	
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );