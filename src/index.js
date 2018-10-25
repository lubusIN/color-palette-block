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
  styles: [
    { name: "polaroid", label: __("Polaroid"), isDefault: true },
    { name: "circle", label: __("Circle") },
    { name: "droplet", label: __("Droplet") }
  ],
  edit: ColorEditor,
  save: ColorPalette
});
