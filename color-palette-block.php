<?php

/**
 * Plugin Name:			BlaBlaBlocks Color Palette Block
 * Description: 		Add color palettes to your website
 * Version: 			2.0.0
 * Requires at least: 	6.6
 * Requires PHP: 		7.4
 * Author: 				LUBUS
 * Author URI:			https://lubus.in
 * License: 			MIT
 * License URI: 		https://www.gnu.org/licenses/MIT
 * Text Domain: 		blablablocks-color-palette-block
 *
 * @package BlaBlaBlocks_Color_Palette_Block
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function blablablocks_color_palette_block_init()
{
	register_block_type(__DIR__ . '/build/');
	register_block_type(__DIR__ . '/build/swatch/');
	register_block_type(__DIR__ . '/build/swatch-color/');
	register_block_type(__DIR__ . '/build/swatch-name/');
	register_block_type(__DIR__ . '/build/swatch-code/');
}
add_action('init', 'blablablocks_color_palette_block_init');
