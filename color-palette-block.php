<?php

/**
 * Contributors: lubus, ajitbohra, punitv342
 * Plugin Name: BlaBlaBlocks Color Palette Block
 * Plugin URI: https://www.lubus.in
 * Description: Add color palettes to your website
 * Author: LUBUS
 * Author URI: https://lubus.in
 * Version: 2.0.0
 * Text Domain: blablablocks-color-palette-block
 * Domain Path: /languages
 * GitHub Plugin URI: https://github.com/lubusIN/color-palette-block
 * Tags: gutenberg, block, colors
 * Requires at least: 6.0.1
 * Tested up to:  6.9
 * Stable tag: 2.0.0
 * License: GPLv3 or later
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 *
 * @package BlaBlaBlocks_Color_Palette_Block
 */

if (! defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

/**
 * Register plugin text domain for translations.
 */
function blablablocks_color_palette_block_load_textdomain()
{
	load_plugin_textdomain('blablablocks-color-palette-block', false, basename(__DIR__) . '/languages');
}
add_action('init', 'blablablocks_color_palette_block_load_textdomain');

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
