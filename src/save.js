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
			<div key={color.id} className={colorClasses} data-color={color.color}>
				{displayStyle === 'polaroid' ? (
					<div className="color-frame">
						<div className="color-swatch-wrapper">
							<div 
								className="color-swatch"
								style={{ backgroundColor: color.color }}
							>
							</div>
						</div>
					</div>
				) : (
					<div 
						className="color-swatch"
						style={{ backgroundColor: color.color }}
					>
					</div>
				)}
				{showColorNames && (
					<div className="color-name">{color.name || 'Untitled'}</div>
				)}
				{showColorCodes && (
					<div className="color-code">{color.color ? color.color.toUpperCase() : ''}</div>
				)}
				<div className="color-copy-buttons">
					<button className="copy-btn" data-format="hex" data-color={color.color}>
						HEX
					</button>
					<button className="copy-btn" data-format="rgb" data-color={color.color}>
						RGB
					</button>
					<button className="copy-btn" data-format="hsl" data-color={color.color}>
						HSL
					</button>
					<button className="copy-btn" data-format="css" data-color={color.color} data-name={color.name}>
						CSS
					</button>
				</div>
			</div>
		);
	};

	return (
		<div {...useBlockProps.save()}>
			<div className={`color-palette color-palette--${displayStyle}`}>
				{colors.length > 0 && (
					<div className="color-grid">
						{colors.map(renderColorItem)}
					</div>
				)}
			</div>
		</div>
	);
}