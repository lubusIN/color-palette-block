import generateColorName from './utils/generateColorName';

/**
 * Legacy block definitions to keep older markup valid and migrate data forward.
 */
const legacyAttributes = {
	colors: {
		type: 'array',
		source: 'query',
		default: [],
		selector: 'ul.wp-block-lubus-color-palette li',
		query: {
			swatch: {
				selector: 'span.cpb-color',
				source: 'text',
				default: ''
			},
			code: {
				selector: 'span.cpb-code',
				source: 'text',
				default: ''
			}
		}
	},
	className: {
		type: 'string'
	}
};

/**
 * Normalize legacy color objects so the new editor UI can consume them safely.
 * Keeps existing ordering stable by deriving ids from their index when needed.
 */
const mapLegacyColors = (legacyColors = []) => {
	const ensureHex = (value = '') => {
		if (!value) {
			return '#000000';
		}
		return value.startsWith('#') ? value : `#${value.replace(/^#/, '')}`;
	};

	return legacyColors
		.filter((color) => color && (color.code || color.swatch))
		.map((color, index) => {
			const rawCode = (color.code || color.swatch || '').trim();
			const normalizedCode = ensureHex(rawCode);
			const swatchName = (color.swatch || '').trim();

			return {
				id: color.id ? String(color.id) : `legacy-color-${index}`,
				color: normalizedCode,
				name: swatchName || generateColorName(normalizedCode)
			};
		});
};

const deprecated = [
	{
		attributes: legacyAttributes,
		migrate: (attributes) => ({
			colors: mapLegacyColors(attributes.colors),
			showColorNames: true,
			showColorCodes: true
		}),
		save: ({ attributes }) => {
			const { colors = [], className = '' } = attributes;

			return (
				<ul className={className}>
					{colors.map((color, index) => (
						<li key={index} className="cpb-card">
							<span className="cpb-color" style={{ backgroundColor: color.code }} />
							<span className="cpb-code">{color.code}</span>
						</li>
					))}
				</ul>
			);
		}
	}
];

export default deprecated;
