/**
 * Block render component
 *
 * @param {object} props Block properties
 * @returns {jsx} Block render
 */
const ColorPalette = props => {
  const { attributes } = props;
  const { colors, className } = attributes;

  return (
    <ul className={className}>
      {// Render colors
      colors.map((color, index) => (
        <li key={index} className="cpb-card">
          <span className="cpb-color" style={{ backgroundColor: color.code }} />
          <span className="cpb-code">{color.code}</span>
        </li>
      ))}
    </ul>
  );
};

export default ColorPalette;
