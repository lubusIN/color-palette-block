/**
 * Shared Interactivity API defaults for the color palette popover UI.
 */
export const DEFAULT_INTERACTIVITY_CONTEXT = {
	activeColorHex: "",
	activeColorName: "",
	isPopoverOpen: false,
	copyStatus: "",
	popoverTop: "0px",
	popoverLeft: "0px",
	closeTimerId: null,
};

/**
 * Supported copy button formats used in the shared popover UI.
 */
export const COPY_BUTTON_FORMATS = ["hex", "rgb", "hsl", "css"];
