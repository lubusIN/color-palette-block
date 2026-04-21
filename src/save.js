/**
 * WordPress dependencies
 */
import { InnerBlocks } from "@wordpress/block-editor";

/**
 * Save only the swatch inner blocks. The frontend wrapper is rendered by
 * render.php so future markup changes can happen server-side.
 *
 * @return {JSX.Element} Saved markup.
 */
export default function save() {
	return <InnerBlocks.Content />;
}
