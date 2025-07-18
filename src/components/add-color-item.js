/**
 * External Dependencies
 */
import React from "react";
import { SketchPicker as ColorPicker } from "react-color";

/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { IconButton, Dropdown } from "@wordpress/components";

/**
 * AddColorItem Component
 *
 * @param {object} props component props
 * @returns {jsx} react element
 */
const AddColorItem = props => {
  // Component props
  const { color, onPickColor, onAddColor, className } = props;

  // Event handler
  const onChangeColor = colorSelected => onPickColor(colorSelected);

  return (
    <Dropdown
      className="blocks-color-item__color-dropdown"
      contentClassName="block-color-item__color-popover"
      position="bottom right"
      headerTitle={__("select Color")}
      renderToggle={({ isOpen, onToggle }) => (
        <IconButton
          isLarge
          className={className}
          onClick={onToggle}
          aria-expanded={isOpen}
          icon="insert"
          label={__("Add Color")}
        >
          {__("Add Color")}
        </IconButton>
      )}
      renderContent={({ onClose }) => {
        const onSelect = () => {
          onAddColor();
          onClose();
        };

        return (
          <div>
            <ColorPicker color={color} onChange={onChangeColor} />

            <IconButton
              isLarge
              icon="plus"
              onClick={onSelect}
              label={__("Insert Color")}
              className="blocks-color-item__insert-button"
            >
              {__("Insert Color")}
            </IconButton>
          </div>
        );
      }}
    />
  );
};

export default AddColorItem;
