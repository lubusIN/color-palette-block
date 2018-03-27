/**
 * Block render component
 *
 * @param {object} props Block properties
 * @returns {jsx} Block render
 */
const ColorPalette = ( props ) => {
	const { attributes } = props;
	const { colors, style } = attributes;

	return <ul className="cpb-colors">
		{
			colors.map( ( color, index ) => (
				<li key={ index } className={ `cpb-${ style }` }>
					<span className="cpb-color" style={ { backgroundColor: color.code } }></span>
					<span className="cpb-code">{ color.code }</span>
				</li>
			) )
		}
	</ul>;
};

export default ColorPalette;
