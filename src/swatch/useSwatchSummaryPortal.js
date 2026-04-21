/**
 * WordPress dependencies
 */
import { useEffect, useState } from "@wordpress/element";

const SWATCH_SUMMARY_ACTION_CLASS = "color-palette-swatch-summary-action";

/**
 * Finds the inspector description node for the currently selected block.
 *
 * This relies on Gutenberg's current inspector markup and is intentionally
 * treated as an unsupported enhancement.
 *
 * @return {HTMLElement|null} Description element or null when unavailable.
 */
const getSwatchSummaryDescription = () =>
	document.querySelector(
		".interface-complementary-area .block-editor-block-card__description",
	);

/**
 * Creates a portal mount directly below the block description in the inspector.
 *
 * @param {boolean} isSelected Whether the swatch is currently selected.
 * @return {HTMLElement|null} Portal container element.
 */
export const useSwatchSummaryPortal = (isSelected) => {
	const [portalTarget, setPortalTarget] = useState(null);

	useEffect(() => {
		if (!isSelected) {
			setPortalTarget(null);
			return undefined;
		}

		let mountedTarget = null;
		let observer = null;

		const mountPortal = () => {
			const description = getSwatchSummaryDescription();

			if (!description || !description.parentElement || mountedTarget) {
				return false;
			}

			mountedTarget = document.createElement("div");
			mountedTarget.className = SWATCH_SUMMARY_ACTION_CLASS;
			description.insertAdjacentElement("afterend", mountedTarget);
			setPortalTarget(mountedTarget);

			return true;
		};

		if (!mountPortal()) {
			observer = new window.MutationObserver(() => {
				if (mountPortal()) {
					observer.disconnect();
					observer = null;
				}
			});
			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
		}

		return () => {
			observer?.disconnect();

			if (mountedTarget?.isConnected) {
				mountedTarget.remove();
			}

			setPortalTarget(null);
		};
	}, [isSelected]);

	return portalTarget;
};
