/**
 * Converts the optional swatch size attribute into the wrapper CSS variable
 * consumed by grid and swatch styles.
 *
 * @param {number|undefined} swatchSize Swatch size attribute value.
 * @return {Object|undefined} Wrapper inline styles.
 */
const getSwatchSizeStyle = (swatchSize) =>
	Number.isFinite(swatchSize)
		? {
				"--cpb-swatch-size": `${swatchSize}px`,
		  }
		: undefined;

export default getSwatchSizeStyle;
