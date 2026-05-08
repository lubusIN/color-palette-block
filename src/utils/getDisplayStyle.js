/**
 * Extracts the selected block style variation slug from the saved className.
 *
 * @param {string} className Wrapper className from Gutenberg.
 * @return {string} Style variation slug.
 */
const getDisplayStyle = (className = "") => {
	if (typeof className !== "string") {
		return "default";
	}

	const styleMatch = className.match(/is-style-([a-z-]+)/);

	return styleMatch ? styleMatch[1] : "default";
};

export default getDisplayStyle;
