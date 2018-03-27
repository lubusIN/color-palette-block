const blockAttributes = {
	colors: {
		type: 'array',
		source: 'query',
		default: [],
		selector: 'ul.cpb-colors li',
		query: {
			swatch: {
				selector: 'span.cpb-color',
				source: 'text',
				default: '',
			},
			code: {
				selector: 'span.cpb-code',
				source: 'text',
				default: '',
			},
		},
	},
	style: {
		type: 'string',
		default: 'card',
	},
};

export default blockAttributes;
