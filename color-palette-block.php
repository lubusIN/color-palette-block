<?php
/**
 * Contributors: lubus, ajitbohra
 * Plugin Name: Color Palette Block
 * Plugin URI: https://www.lubus.in
 * Description: Add color palettes to your website
 * Author: LUBUS
 * Author URI: https://lubus.in
 * Version: 1.0
 * Text Domain: cpb
 * Domain Path: /languages
 * GitHub Plugin URI: https://github.com/lubusIN/color-palette-block
 * Tags: gutenberg, block, animation
 * Requires at least: 3.0.1
 * Tested up to:  4.9.4
 * Stable tag: 1.0
 * License: GPLv3 or later
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 *
 * @package lubusIN_Color_Palette_Block
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

if ( ! class_exists( 'lubusIN_Color_Palette_Block' ) ) :
/**
 * lubusIN_Color_Palette_Block Class.
 *
 * Main Class.
 *
 * @since 1.0.0
 */
class lubusIN_Color_Palette_Block {
	/**
	 * Instance.
	 *
	 * @since
	 * @access private
	 * @var lubusIN_Color_Palette_Block
	 */
	static private $instance;

	/**
	 * Singleton pattern.
	 *
	 * @since
	 * @access private
	 */
	private function __construct() {
		$this->setup_constants();
        $this->init_hooks();
	}


	/**
	 * Get instance.
	 *
	 * @since
	 * @access public
	 * @return lubusIN_Color_Palette_Block
	 */
	public static function get_instance() {
		if ( null === static::$instance ) {
			self::$instance = new static();
		}

		return self::$instance;
	}

	/**
	 * Hook into actions and filters.
	 *
	 * @since  1.0.0
	 */
	private function init_hooks() {
		// Set up localization on init Hook.
		add_action( 'init', array( $this, 'load_textdomain' ), 0 );
		add_action( 'init', array( $this, 'register_color_palette' ) );
	}

	/**
	 * Throw error on object clone
	 *
	 * The whole idea of the singleton design pattern is that there is a single
	 * object, therefore we don't want the object to be cloned.
	 *
	 * @since  1.0
	 * @access protected
	 *
	 * @return void
	 */
	public function __clone() {
		// Cloning instances of the class is forbidden.
		cpb_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'cpb' ), '1.0' );
	}

	/**
	 * Disable unserializing of the class
	 *
	 * @since  1.0
	 * @access protected
	 *
	 * @return void
	 */
	public function __wakeup() {
		// Unserializing instances of the class is forbidden.
		cpb_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'cpb' ), '1.0' );
	}

	/**
	 * Setup plugin constants
	 *
	 * @since  1.0
	 * @access private
	 *
	 * @return void
	 */
	private function setup_constants() {
		// Plugin version
		if ( ! defined( 'CPB_VERSION' ) ) {
			define( 'CPB_VERSION', '1.0.0' );
		}
		// Plugin Root File
		if ( ! defined( 'CPB_PLUGIN_FILE' ) ) {
			define( 'CPB_PLUGIN_FILE', __FILE__ );
		}
		// Plugin Folder Path
		if ( ! defined( 'CPB_PLUGIN_DIR' ) ) {
			define( 'CPB_PLUGIN_DIR', plugin_dir_path( CPB_PLUGIN_FILE ) );
		}
		// Plugin Folder URL
		if ( ! defined( 'CPB_PLUGIN_URL' ) ) {
			define( 'CPB_PLUGIN_URL', plugin_dir_url( CPB_PLUGIN_FILE ) );
		}
		// Plugin Basename aka: "color-palette-block/color-palette-block.php"
		if ( ! defined( 'CPB_PLUGIN_BASENAME' ) ) {
			define( 'CPB_PLUGIN_BASENAME', plugin_basename( CPB_PLUGIN_FILE ) );
		}
	}

	/**
	 * Loads the plugin language files.
	 *
	 * @since  1.0.0
	 * @access public
	 *
	 * @return void
	 */
	public function load_textdomain() {
		$locale = apply_filters( 'plugin_locale', get_locale(), 'cpb' );
		// wp-content/languages/plugin-name/plugin-name-en_EN.mo.
		load_textdomain( 'cpb', trailingslashit( WP_LANG_DIR ) . 'color-palette-block' . '/' . 'cpb' . '-' . $locale . '.mo' );
		// wp-content/plugins/plugin-name/languages/plugin-name-en_EN.mo.
		load_plugin_textdomain( 'cpb', false, basename( CPB_PLUGIN_DIR ) . '/languages/' );
	}

	/**
	 * Registers scripts
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return void
	 */
	public function register_color_palette(){
		$block_js = 'build/colors.js';
		$block_css = 'build/colors.css';

		// Script
		wp_register_script(
			'color-palette-block-js',
			CPB_PLUGIN_URL . $block_js,
			array(
				'wp-blocks',
				'wp-i18n',
			),
			filemtime( CPB_PLUGIN_DIR . $block_js )
		);

		// Style
		wp_register_style(
			'color-palette-block',
			CPB_PLUGIN_URL . $block_css,
			array(
				'wp-blocks',
			),
			filemtime(CPB_PLUGIN_DIR . $block_css)
		);

		// Register block type
		register_block_type('lubus/color-palette-block', array(
			'style'         => 'color-palette-block',
			'script'        => 'color-palette-block-js',
		));
	}
}

endif;

lubusIN_Color_Palette_Block::get_instance();
?>
