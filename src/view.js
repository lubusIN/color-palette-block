/**
 * Frontend JavaScript for the Color Palette block.
 * Handles color code copying functionality with improved detection and visibility.
 */

document.addEventListener('DOMContentLoaded', function() {
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

	// Handle copy button clicks
	function handleCopyClick(event) {
		event.preventDefault();
		event.stopPropagation();

		const button = event.target;
		const format = button.dataset.format;
		const color = button.dataset.color;
		const colorName = button.dataset.name || '';

		if (!color || !format) return;

		const formattedColor = formatColor(color, format, colorName);
		const originalText = button.textContent;

		// Show copying state
		button.textContent = '...';
		button.disabled = true;

		copyToClipboard(formattedColor).then(success => {
			if (success) {
				// Show success state
				button.textContent = '✓';
				button.classList.add('copied');

				setTimeout(() => {
					button.textContent = originalText;
					button.classList.remove('copied');
					button.disabled = false;
				}, 1500);
			} else {
				// Show error state
				button.textContent = '✗';
				button.classList.add('failed');

				setTimeout(() => {
					button.textContent = originalText;
					button.classList.remove('failed');
					button.disabled = false;
				}, 1500);
			}
		});
	}

	// Initialize copy functionality with better hover handling
	function initializeCopyButtons() {
		// Find all color palette blocks
		const paletteBlocks = document.querySelectorAll('.wp-block-lubus-color-palette');

		paletteBlocks.forEach(block => {
			const colorItems = block.querySelectorAll('.color-item');

			colorItems.forEach(colorItem => {
				const copyButtons = colorItem.querySelectorAll('.copy-btn');
				const copyButtonsContainer = colorItem.querySelector('.color-copy-buttons');

				if (copyButtons.length > 0 && copyButtonsContainer) {
					// Enhanced hover handling
					let hoverTimeout;

					// Show buttons on color item hover
					colorItem.addEventListener('mouseenter', () => {
						clearTimeout(hoverTimeout);
						copyButtonsContainer.style.opacity = '1';
						copyButtonsContainer.style.visibility = 'visible';
						copyButtonsContainer.style.pointerEvents = 'auto';
					});

					// Keep buttons visible when hovering over buttons container
					copyButtonsContainer.addEventListener('mouseenter', () => {
						clearTimeout(hoverTimeout);
						copyButtonsContainer.style.opacity = '1';
						copyButtonsContainer.style.visibility = 'visible';
						copyButtonsContainer.style.pointerEvents = 'auto';
					});

					// Hide buttons with delay when leaving color item
					colorItem.addEventListener('mouseleave', () => {
						hoverTimeout = setTimeout(() => {
							if (!copyButtonsContainer.matches(':hover')) {
								copyButtonsContainer.style.opacity = '0';
								copyButtonsContainer.style.visibility = 'hidden';
								copyButtonsContainer.style.pointerEvents = 'none';
							}
						}, 150);
					});

					// Hide buttons when leaving buttons container
					copyButtonsContainer.addEventListener('mouseleave', () => {
						hoverTimeout = setTimeout(() => {
							if (!colorItem.matches(':hover')) {
								copyButtonsContainer.style.opacity = '0';
								copyButtonsContainer.style.visibility = 'hidden';
								copyButtonsContainer.style.pointerEvents = 'none';
							}
						}, 150);
					});

					// Add click handlers to copy buttons
					copyButtons.forEach(button => {
						button.addEventListener('click', handleCopyClick);
					});
				}
			});
		});
	}

	// Initialize copy button functionality
	initializeCopyButtons();

	// Also handle dynamic content with event delegation as fallback
	document.addEventListener('click', function(event) {
		// Check if the clicked element is a copy button
		if (event.target.matches('.wp-block-lubus-color-palette .copy-btn')) {
			handleCopyClick(event);
		}
	});

	// Re-initialize if content changes (for dynamic content)
	const observer = new MutationObserver(() => {
		setTimeout(initializeCopyButtons, 100);
	});

	// Observe changes to the document
	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
});
