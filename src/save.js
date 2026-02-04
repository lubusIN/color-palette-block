/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

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

	// Extract display style from className
	const getDisplayStyle = () => {
		if (className && className.includes('is-style-')) {
			const styleMatch = className.match(/is-style-([a-z-]+)/);
			return styleMatch ? styleMatch[1] : 'default';
		}
		return 'default';
	};

	const displayStyle = getDisplayStyle();

	const renderColorItem = (color) => {
		// Add safety checks to prevent undefined errors
		if (!color || !color.color) {
			return null;
		}
		
		const colorClasses = `color-item color-item--${displayStyle}`;
		
		return (
			<div 
				key={color.id} 
				className={colorClasses} 
			>
				{displayStyle === 'polaroid' ? (
					<div className="color-frame">
						<div className="color-swatch-wrapper">
							<div 
								className="color-swatch"
								style={{ backgroundColor: color.color }}
								data-color-hex={color.color}
								data-color-name={color.name || ''}
								data-wp-on--mouseenter="actions.openPopover"
								data-wp-on--mouseleave="actions.startCloseTimer"
							>
							</div>
						</div>
					</div>
				) : (
					<div 
						className="color-swatch"
						style={{ backgroundColor: color.color }}
						data-color-hex={color.color}
						data-color-name={color.name || ''}
						data-wp-on--mouseenter="actions.openPopover"
						data-wp-on--mouseleave="actions.startCloseTimer"
					>
					</div>
				)}
				{showColorNames && (
					<div className="color-name">{color.name || 'Untitled'}</div>
				)}
				{showColorCodes && (
					<div className="color-code">{color.color ? color.color.toUpperCase() : ''}</div>
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
				popoverLeft: '0px'
			})}
		>
			<div className={`color-palette color-palette--${displayStyle}`}>
				{colors.length > 0 && (
					<div className="color-grid">
						{colors.map(renderColorItem)}
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