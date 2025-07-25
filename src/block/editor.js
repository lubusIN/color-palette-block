/**
 * External Dependencies
 */
import { filter } from "lodash";

/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { Component, Fragment } from "@wordpress/element";
import { Placeholder } from "@wordpress/components";

/**
 * Internal Dependencies
 */
import ColorItem from "../components/color-item";
import AddColorItem from "../components/add-color-item";
import icons from "../data/icons";

/**
 * Color Palette Editor UI Component
 *
 * @class ColorEditor
 * @extends {Component}
 */
class ColorEditor extends Component {
  constructor() {
    super(...arguments);

    // Event binding
    this.onAddColor = this.onAddColor.bind(this);
    this.onSelectColor = this.onSelectColor.bind(this);
    this.onRemoveColor = this.onRemoveColor.bind(this);
    this.onPickColor = this.onPickColor.bind(this);

    // Initial state
    this.state = {
      selectedColor: null,
      pickedColor: "#22194D"
    };
  }

  componentDidUpdate(prevProps) {
    // Component Lifecycle: Deselect color when deselecting the block
    if (!this.props.isSelected && prevProps.isSelected) {
      this.setState({
        selectedColor: null
      });
    }
  }

  onAddColor() {
    const { pickedColor } = this.state;
    const { attributes, setAttributes } = this.props;
    const { colors } = attributes;

    const newColor = {
      swatch: "",
      code: pickedColor
    };

    setAttributes({
      colors: colors.concat(newColor)
    });
  }

  onSelectColor(index) {
    const { selectedColor } = this.state;

    if (selectedColor !== index) {
      this.setState({
        selectedColor: index
      });
    }
  }

  onRemoveColor(index) {
    const { attributes, setAttributes } = this.props;
    const { colors } = attributes;

    const finalColors = filter(colors, (color, i) => index !== i);

    this.setState({ selectedColor: null });

    setAttributes({
      colors: finalColors
    });
  }

  onPickColor(color) {
    this.setState({
      pickedColor: color.hex
    });
  }

  render() {
    const { selectedColor, pickedColor } = this.state;
    const { attributes, isSelected, className } = this.props;
    const { colors } = attributes;

    // Display placeholder if palette is empty
    if (colors.length === 0) {
      return (
        <Placeholder
          key="cpb-placeholder"
          icon={icons.logo}
          label={__("Colors")}
          instructions={__("Add colors to create your palette")}
        >
          <AddColorItem
            color={pickedColor}
            onAddColor={this.onAddColor}
            onPickColor={this.onPickColor}
            items={false}
          />
        </Placeholder>
      );
    }

    return (
      <Fragment>
        <ul className={className}>
          {// Display colors stored in attributes
          colors.map((color, index) => (
            <ColorItem
              key={index}
              code={color.code}
              isSelected={isSelected && selectedColor === index}
              onSelect={e => this.onSelectColor(index, e)}
              onRemove={e => this.onRemoveColor(index, e)}
            />
          ))}
        </ul>

        {// If block is selected display add color button
        isSelected && (
          <AddColorItem
            className="blocks-color-item__full-button"
            color={pickedColor}
            onAddColor={this.onAddColor}
            onPickColor={this.onPickColor}
          />
        )}
      </Fragment>
    );
  }
}

export default ColorEditor;
