/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";

/**
 * Internal Dependencies
 */
import blockAttributes from "./data/attributes";
import icons from "./data/icons";
import ColorEditor from "./block/editor";
import ColorPalette from "./block/render";
import "./style/style.scss";
import "./style/editor.scss";

/**
 * Register Color Palette Block
 */
registerBlockType("lubus/color-palette", {
  title: __("Color Palette"),
  description: __("Create and share color palettes"),
  icon: icons.logo,
  category: "layout",
  attributes: blockAttributes,
  edit: ColorEditor,
  save: ColorPalette
});
