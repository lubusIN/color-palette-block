/**
 * WordPress dependencies
 */
import { __, sprintf } from "@wordpress/i18n";

/**
 * Builds the shared attributes used by clickable swatch color triggers.
 *
 * @param {Object} options                 Trigger options.
 * @param {string} options.accessibleLabel Label used in the aria text.
 * @param {string} options.colorName       Color name copied into data attrs.
 * @param {string} options.colorValue      Color code copied into data attrs.
 * @return {Object} Swatch trigger attributes.
 */
export const getSwatchTriggerProps = ({
	accessibleLabel,
	colorName = "",
	colorValue,
}) => ({
	role: "button",
	tabIndex: 0,
	"aria-label": sprintf(
		__("Show copy options for %s", "color-palette-block-wp"),
		accessibleLabel || __("this color swatch", "color-palette-block-wp"),
	),
	"data-color-hex": colorValue,
	"data-color-name": colorName,
	"data-wp-on--mouseenter": "actions.openPopover",
	"data-wp-on--mouseleave": "actions.startCloseTimer",
	"data-wp-on--focusin": "actions.openPopover",
	"data-wp-on--focusout": "actions.startCloseTimer",
	"data-wp-on--click": "actions.openPopover",
	"data-wp-on--keydown": "actions.handleSwatchKeydown",
});
