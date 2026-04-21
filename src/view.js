/* global clearTimeout, navigator, setTimeout */

/**
 * WordPress dependencies
 */
import { store, getContext } from "@wordpress/interactivity";

/**
 * Internal dependencies
 */
import { COPY_BUTTON_FORMATS } from "./utils/interactivity";
import { hexToHsl, hexToRgb } from "./utils/colorValue";

/**
 * Internal constants
 */
const POPOVER_VERTICAL_GAP = 8;
const POPOVER_CLOSE_DELAY = 150;
const COPY_STATUS_RESET_DELAY = 1500;
const COPY_BUTTON_LABELS = COPY_BUTTON_FORMATS.reduce(
	(labels, format) => ({
		...labels,
		[format]: format.toUpperCase(),
	}),
	{},
);
const COPY_STATUS_SYMBOLS = {
	success: "✓",
	failed: "✗",
};

/**
 * Generates the CSS custom property name for the active swatch.
 *
 * @param {string} colorName Active swatch name.
 * @return {string} CSS custom property name.
 */
const getCssVariableName = (colorName = "") =>
	colorName
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "") || "color";

/**
 * Formats the active swatch color for the requested copy action.
 *
 * @param {string} color     Normalized hex color.
 * @param {string} format    Requested output format.
 * @param {string} colorName Active swatch name.
 * @return {string} Formatted color string.
 */
function formatColor(color, format, colorName = "") {
	switch (format) {
		case "hex":
			return color.toUpperCase();
		case "rgb": {
			const rgb = hexToRgb(color);
			return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : color;
		}
		case "hsl": {
			const hsl = hexToHsl(color);
			return hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : color;
		}
		case "css": {
			const cssVarName = getCssVariableName(colorName);
			return `--${cssVarName}: ${color.toLowerCase()};`;
		}
		default:
			return color;
	}
}

/**
 * Copies text to the clipboard using the modern API when available and a legacy
 * textarea fallback when the editor runs inside an iframe.
 *
 * @param {string} text Text to copy.
 * @return {Promise<boolean>} Whether the copy action succeeded.
 */
async function copyToClipboard(text) {
	try {
		if (navigator.clipboard && window.isSecureContext && !window.frameElement) {
			await navigator.clipboard.writeText(text);
			return true;
		}
	} catch (error) {
		// Fall through to legacy method
	}

	// Legacy method that works better in iframes and insecure contexts
	const textArea = document.createElement("textarea");

	try {
		textArea.value = text;

		textArea.style.position = "fixed";
		textArea.style.left = "-9999px";
		textArea.style.top = "-9999px";
		textArea.style.opacity = "0";
		textArea.setAttribute("readonly", "");
		textArea.setAttribute("aria-hidden", "true");

		document.body.appendChild(textArea);

		textArea.select();
		textArea.setSelectionRange(0, 99999); // For mobile devices

		return document.execCommand("copy");
	} catch (error) {
		console.error("Copy failed:", error);
		return false;
	} finally {
		textArea.remove();
	}
}

/**
 * Clears a pending popover close timer from the current block context.
 *
 * @param {Object} context Interactivity context.
 * @return {void}
 */
const clearCloseTimer = (context) => {
	if (!context.closeTimerId) {
		return;
	}

	clearTimeout(context.closeTimerId);
	context.closeTimerId = null;
};

/**
 * Builds the normalized copy status key stored in context.
 *
 * @param {string} format Copy format.
 * @param {string} result Copy result.
 * @return {string} Copy status key.
 */
const getCopyStatus = (format, result) => `${format}-${result}`;

/**
 * Opens and positions the shared copy popover relative to the active swatch.
 *
 * @param {Event} event Swatch interaction event.
 * @return {void}
 */
const openPopoverFromEvent = (event) => {
	const context = getContext();
	const swatch = event?.currentTarget || event?.target;

	if (!swatch) {
		return;
	}

	clearCloseTimer(context);

	const colorHex = swatch.dataset.colorHex;
	const colorName = swatch.dataset.colorName || "";

	if (!colorHex) {
		return;
	}

	const blockWrapper = swatch.closest(
		'[data-wp-interactive="lubus/color-palette"]',
	);
	if (!blockWrapper) {
		return;
	}

	const blockRect = blockWrapper.getBoundingClientRect();
	const colorItem = swatch.closest(".color-item");
	const anchorRect = colorItem
		? colorItem.getBoundingClientRect()
		: swatch.getBoundingClientRect();
	const top = anchorRect.bottom - blockRect.top + POPOVER_VERTICAL_GAP;
	const left = anchorRect.left - blockRect.left + anchorRect.width / 2;

	context.activeColorHex = colorHex;
	context.activeColorName = colorName;
	context.isPopoverOpen = true;
	context.copyStatus = "";
	context.popoverTop = `${top}px`;
	context.popoverLeft = `${left}px`;
};

/**
 * Returns the current button label for a copy format based on copy state.
 *
 * @param {string} format Copy format.
 * @return {string} Button label or status symbol.
 */
const getButtonText = (format) => {
	const context = getContext();
	const label = COPY_BUTTON_LABELS[format];

	if (context.copyStatus === getCopyStatus(format, "success")) {
		return COPY_STATUS_SYMBOLS.success;
	}

	if (context.copyStatus === getCopyStatus(format, "failed")) {
		return COPY_STATUS_SYMBOLS.failed;
	}

	return label;
};

/**
 * Checks whether the current context matches a specific copy status.
 *
 * @param {string} format Copy format.
 * @param {string} result Copy result.
 * @return {boolean} Whether the context matches the requested status.
 */
const hasCopyStatus = (format, result) =>
	getContext().copyStatus === getCopyStatus(format, result);

store("lubus/color-palette", {
	state: {
		get hexButtonText() {
			return getButtonText("hex");
		},
		get rgbButtonText() {
			return getButtonText("rgb");
		},
		get hslButtonText() {
			return getButtonText("hsl");
		},
		get cssButtonText() {
			return getButtonText("css");
		},
		get isHexCopied() {
			return hasCopyStatus("hex", "success");
		},
		get isRgbCopied() {
			return hasCopyStatus("rgb", "success");
		},
		get isHslCopied() {
			return hasCopyStatus("hsl", "success");
		},
		get isCssCopied() {
			return hasCopyStatus("css", "success");
		},
		get isHexFailed() {
			return hasCopyStatus("hex", "failed");
		},
		get isRgbFailed() {
			return hasCopyStatus("rgb", "failed");
		},
		get isHslFailed() {
			return hasCopyStatus("hsl", "failed");
		},
		get isCssFailed() {
			return hasCopyStatus("css", "failed");
		},
	},
	actions: {
		openPopover(event) {
			openPopoverFromEvent(event);
		},
		startCloseTimer() {
			const context = getContext();

			clearCloseTimer(context);
			context.closeTimerId = setTimeout(() => {
				context.isPopoverOpen = false;
				context.closeTimerId = null;
			}, POPOVER_CLOSE_DELAY);
		},
		cancelCloseTimer() {
			clearCloseTimer(getContext());
		},
		closePopover() {
			const context = getContext();

			clearCloseTimer(context);
			context.isPopoverOpen = false;
		},
		handleSwatchKeydown(event) {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				openPopoverFromEvent(event);
			}
		},
		async copyColor(event) {
			event.preventDefault();
			event.stopPropagation();

			const context = getContext();
			const button = event.currentTarget;
			const format = button.dataset.format;
			const colorHex = context.activeColorHex;
			const colorName = context.activeColorName;

			if (!colorHex || !format) return;

			const formattedColor = formatColor(colorHex, format, colorName);

			button.disabled = true;

			const success = await copyToClipboard(formattedColor);

			context.copyStatus = getCopyStatus(
				format,
				success ? "success" : "failed",
			);

			setTimeout(() => {
				context.copyStatus = "";
				button.disabled = false;
			}, COPY_STATUS_RESET_DELAY);
		},
	},
});
