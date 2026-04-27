/**
 * WordPress dependencies
 */
import { useInnerBlocksProps } from "@wordpress/block-editor";

/**
 * Save the inner blocks wrapper so dynamic frontend rendering still gives
 * WordPress layout support a stable container to target.
 *
 * @return {JSX.Element} Saved markup.
 */
export default function save() {
	return (
		<div
			{...useInnerBlocksProps.save({
				className: "color-palette__items",
			})}
		/>
	);
}
