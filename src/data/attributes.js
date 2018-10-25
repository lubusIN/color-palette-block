/**
 * Block Attributes
 */
const blockAttributes = {
  colors: {
    type: "array",
    source: "query",
    default: [],
    selector: "ul.wp-block-lubus-color-palette li",
    query: {
      swatch: {
        selector: "span.cpb-color",
        source: "text",
        default: ""
      },
      code: {
        selector: "span.cpb-code",
        source: "text",
        default: ""
      }
    }
  },
  className: {
    type: "string"
  }
};

export default blockAttributes;
