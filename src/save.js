/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __, sprintf } from '@wordpress/i18n';
import getDisplayStyle from './utils/getDisplayStyle';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes, className }) {
	const {
		colors,
		showColorNames,
		showColorCodes
	} = attributes;

	const paletteColors = Array.isArray(colors) ? colors : [];
	const displayStyle = getDisplayStyle(className);

	const renderColorItem = (color) => {
		// Add safety checks to prevent undefined errors
		if (!color || !color.color) {
			return null;
		}

		const colorClasses = `color-item color-item--${displayStyle}`;
		const colorCode = color.color ? color.color.toUpperCase() : '';
		const fallbackName = color.name || __('Untitled', 'color-palette-block-wp');
		const swatchLabel = sprintf(
			__('Show copy options for %s', 'color-palette-block-wp'),
			fallbackName
		);

		const swatch = (
			<div
				className="color-swatch"
				style={{ backgroundColor: color.color }}
				role="button"
				tabIndex={0}
				aria-label={swatchLabel}
				data-color-hex={color.color}
				data-color-name={color.name || ''}
				data-wp-on--mouseenter="actions.openPopover"
				data-wp-on--mouseleave="actions.startCloseTimer"
				data-wp-on--focusin="actions.openPopover"
				data-wp-on--focusout="actions.startCloseTimer"
				data-wp-on--click="actions.openPopover"
				data-wp-on--keydown="actions.handleSwatchKeydown"
			>
			</div>
		);

		return (
			<div
				key={color.id}
				className={colorClasses}
			>
				{displayStyle === 'polaroid' ? (
					<div className="color-frame">
						<div className="color-swatch-wrapper">
							{swatch}
						</div>
					</div>
				) : (
					swatch
				)}
				{showColorNames && (
					<div className="color-name">{fallbackName}</div>
				)}
				{showColorCodes && (
					<div className="color-code">{colorCode}</div>
				)}
			</div>
		);
	};

	return (
		<div
			{...useBlockProps.save()}
			data-wp-interactive="lubus/color-palette"
			data-wp-context={JSON.stringify({
				activeColorHex: '',
				activeColorName: '',
				isPopoverOpen: false,
				copyStatus: '',
				popoverTop: '0px',
				popoverLeft: '0px',
				closeTimerId: null
			})}
		>
			<div className={`color-palette color-palette--${displayStyle}`}>
				{paletteColors.length > 0 && (
					<div className="color-grid">
						{paletteColors.map(renderColorItem)}
					</div>
				)}
			</div>
			{/* Single shared popover - rendered once for all colors */}
			<div
				className="color-copy-popover"
				data-wp-class--is-open="context.isPopoverOpen"
				data-wp-style--top="context.popoverTop"
				data-wp-style--left="context.popoverLeft"
				data-wp-on--mouseenter="actions.cancelCloseTimer"
				data-wp-on--mouseleave="actions.closePopover"
				data-wp-on--focusin="actions.cancelCloseTimer"
				data-wp-on--focusout="actions.startCloseTimer"
			>
				<button
					className="copy-btn"
					data-format="hex"
					data-wp-on--click="actions.copyColor"
					data-wp-class--copied="state.isHexCopied"
					data-wp-class--failed="state.isHexFailed"
					data-wp-text="state.hexButtonText"
				>
					HEX
				</button>
				<button
					className="copy-btn"
					data-format="rgb"
					data-wp-on--click="actions.copyColor"
					data-wp-class--copied="state.isRgbCopied"
					data-wp-class--failed="state.isRgbFailed"
					data-wp-text="state.rgbButtonText"
				>
					RGB
				</button>
				<button
					className="copy-btn"
					data-format="hsl"
					data-wp-on--click="actions.copyColor"
					data-wp-class--copied="state.isHslCopied"
					data-wp-class--failed="state.isHslFailed"
					data-wp-text="state.hslButtonText"
				>
					HSL
				</button>
				<button
					className="copy-btn"
					data-format="css"
					data-wp-on--click="actions.copyColor"
					data-wp-class--copied="state.isCssCopied"
					data-wp-class--failed="state.isCssFailed"
					data-wp-text="state.cssButtonText"
				>
					CSS
				</button>
			</div>
		</div>
	);
}
