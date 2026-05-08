<?php
/**
 * Server render callback for the Color Palette block.
 *
 * @package lubusIN_Color_Palette_Block
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$context = array(
	'activeColorHex'  => '',
	'activeColorName' => '',
	'isPopoverOpen'  => false,
	'copyStatus'     => '',
	'popoverTop'     => '0px',
	'popoverLeft'    => '0px',
	'closeTimerId'   => null,
);

$copy_button_formats = array( 'hex', 'rgb', 'hsl', 'css' );

$get_display_style = static function ( $class_name = '' ) {
	if ( ! is_string( $class_name ) ) {
		return 'default';
	}

	if ( preg_match( '/is-style-([a-z-]+)/', $class_name, $matches ) ) {
		return $matches[1];
	}

	return 'default';
};

$render_copy_button = static function ( $format ) {
	$format_label = strtoupper( $format );
	$format_name  = ucfirst( strtolower( $format_label ) );

	return sprintf(
		'<button class="copy-btn" data-format="%1$s" data-wp-on--click="actions.copyColor" data-wp-class--copied="state.is%2$sCopied" data-wp-class--failed="state.is%2$sFailed" data-wp-text="state.%1$sButtonText">%3$s</button>',
		esc_attr( $format ),
		esc_attr( $format_name ),
		esc_html( $format_label )
	);
};

/*
 * Existing saved content already contains the complete wrapper. Return it as-is
 * to avoid duplicate wrappers until the post is edited and re-saved.
 */
if (
	false !== strpos( $content, 'data-wp-interactive="lubus/color-palette"' ) &&
	false !== strpos( $content, 'color-copy-popover' )
) {
	echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	return;
}

$extra_attributes = array(
	'data-wp-interactive' => 'lubus/color-palette',
	'data-wp-context'     => wp_json_encode( $context ),
);

if ( isset( $attributes['swatchSize'] ) && is_numeric( $attributes['swatchSize'] ) ) {
	$extra_attributes['style'] = sprintf(
		'--cpb-swatch-size: %spx;',
		esc_attr( (string) $attributes['swatchSize'] )
	);
}

$display_style = $get_display_style( $attributes['className'] ?? '' );
$has_layout_wrapper = false !== strpos( $content, 'class="color-palette__items' ) || false !== strpos( $content, "class='color-palette__items" );

if ( ! $has_layout_wrapper ) {
	/*
	 * The first dynamic save implementation stored only raw inner blocks. Add the
	 * missing wrapper in the rendered HTML and mirror that wrapper into the parsed
	 * block data so core layout support targets `.color-palette__items` instead of
	 * the outer interactive wrapper.
	 */
	if ( isset( $block ) && $block instanceof WP_Block ) {
		$block->parsed_block['innerContent'] = array( '<div class="color-palette__items">', null, '</div>' );
	}

	$content = sprintf(
		'<div class="color-palette__items">%s</div>',
		$content
	);
}
?>

<div <?php echo get_block_wrapper_attributes( $extra_attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="<?php echo esc_attr( "color-palette color-palette--{$display_style}" ); ?>">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
	<div
		class="color-copy-popover"
		data-wp-class--is-open="context.isPopoverOpen"
		data-wp-style--top="context.popoverTop"
		data-wp-style--left="context.popoverLeft"
		data-wp-on--mouseenter="actions.cancelCloseTimer"
		data-wp-on--mouseleave="actions.closePopover"
		data-wp-on--focusin="actions.cancelCloseTimer"
		data-wp-on--focusout="actions.startCloseTimer"
	>
		<?php
		foreach ( $copy_button_formats as $format ) {
			echo $render_copy_button( $format ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		?>
	</div>
</div>
