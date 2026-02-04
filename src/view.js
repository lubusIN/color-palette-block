/**
 * WordPress Interactivity API for the Color Palette block.
 * Handles color code copying functionality with popover and copy state management.
 */
import { store, getContext } from '@wordpress/interactivity';

// Color format conversion functions
function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (!result) return null;

	return {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	};
}

function hexToHsl(hex) {
	const rgb = hexToRgb(hex);
	if (!rgb) return null;

	let { r, g, b } = rgb;
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;

	if (max === min) {
		h = s = 0;
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100)
	};
}

function formatColor(color, format, colorName = '') {
	switch (format) {
		case 'hex':
			return color.toUpperCase();
		case 'rgb':
			const rgb = hexToRgb(color);
			return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : color;
		case 'hsl':
			const hsl = hexToHsl(color);
			return hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : color;
		case 'css':
			const cssVarName = colorName
				.toLowerCase()
				.replace(/[^a-z0-9]/g, '-')
				.replace(/-+/g, '-')
				.replace(/^-|-$/g, '') || 'color';
			return `--${cssVarName}: ${color.toLowerCase()};`;
		default:
			return color;
	}
}

async function copyToClipboard(text) {
	try {
		// Try modern clipboard API first (works in secure contexts)
		if (navigator.clipboard && window.isSecureContext && !window.frameElement) {
			await navigator.clipboard.writeText(text);
			return true;
		}
	} catch (error) {
		// Fall through to legacy method
	}

	// Legacy method that works better in iframes and insecure contexts
	try {
		const textArea = document.createElement('textarea');
		textArea.value = text;

		// Make the textarea invisible but accessible
		textArea.style.position = 'fixed';
		textArea.style.left = '-9999px';
		textArea.style.top = '-9999px';
		textArea.style.opacity = '0';
		textArea.setAttribute('readonly', '');
		textArea.setAttribute('aria-hidden', 'true');

		document.body.appendChild(textArea);

		// Select and copy
		textArea.select();
		textArea.setSelectionRange(0, 99999); // For mobile devices

		const success = document.execCommand('copy');
		document.body.removeChild(textArea);

		return success;
	} catch (error) {
		console.error('Copy failed:', error);
		return false;
	}
}

const { state } = store('lubus/color-palette', {
	state: {
		get hexButtonText() {
			const context = getContext();
			if (context.copyStatus === 'hex-success') return '✓';
			if (context.copyStatus === 'hex-failed') return '✗';
			return 'HEX';
		},
		get rgbButtonText() {
			const context = getContext();
			if (context.copyStatus === 'rgb-success') return '✓';
			if (context.copyStatus === 'rgb-failed') return '✗';
			return 'RGB';
		},
		get hslButtonText() {
			const context = getContext();
			if (context.copyStatus === 'hsl-success') return '✓';
			if (context.copyStatus === 'hsl-failed') return '✗';
			return 'HSL';
		},
		get cssButtonText() {
			const context = getContext();
			if (context.copyStatus === 'css-success') return '✓';
			if (context.copyStatus === 'css-failed') return '✗';
			return 'CSS';
		},
		// Copied status getters for class bindings
		get isHexCopied() {
			return getContext().copyStatus === 'hex-success';
		},
		get isRgbCopied() {
			return getContext().copyStatus === 'rgb-success';
		},
		get isHslCopied() {
			return getContext().copyStatus === 'hsl-success';
		},
		get isCssCopied() {
			return getContext().copyStatus === 'css-success';
		},
		// Failed status getters for class bindings
		get isHexFailed() {
			return getContext().copyStatus === 'hex-failed';
		},
		get isRgbFailed() {
			return getContext().copyStatus === 'rgb-failed';
		},
		get isHslFailed() {
			return getContext().copyStatus === 'hsl-failed';
		},
		get isCssFailed() {
			return getContext().copyStatus === 'css-failed';
		}
	},
	actions: {
		togglePopover() {
			const context = getContext();
			context.isPopoverOpen = !context.isPopoverOpen;
		},
		closePopover() {
			const context = getContext();
			context.isPopoverOpen = false;
		},
		async copyColor(event) {
			event.preventDefault();
			event.stopPropagation();

			const context = getContext();
			const button = event.target;
			const format = button.dataset.format;
			const colorHex = context.colorHex;
			const colorName = context.colorName;

			if (!colorHex || !format) return;

			const formattedColor = formatColor(colorHex, format, colorName);

			// Disable button during copy
			button.disabled = true;

			const success = await copyToClipboard(formattedColor);

			if (success) {
				context.copyStatus = `${format}-success`;
			} else {
				context.copyStatus = `${format}-failed`;
			}

			// Reset after delay
			setTimeout(() => {
				context.copyStatus = '';
				button.disabled = false;
			}, 1500);
		}
	}
});
