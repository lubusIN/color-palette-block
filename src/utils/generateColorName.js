/**
 * Generate a human-readable color name from a hex string.
 * Shared between the editor UI and legacy migrations.
 */
const generateColorName = (hexColor) => {
	if (!hexColor || !hexColor.startsWith('#')) {
		return 'Untitled Color';
	}

	const hex = hexColor.slice(1);
	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);

	const rNorm = r / 255;
	const gNorm = g / 255;
	const bNorm = b / 255;

	const max = Math.max(rNorm, gNorm, bNorm);
	const min = Math.min(rNorm, gNorm, bNorm);
	const diff = max - min;

	const lightness = (max + min) / 2;

	let saturation = 0;
	if (diff !== 0) {
		saturation = lightness > 0.5 ? diff / (2 - max - min) : diff / (max + min);
	}

	let hue = 0;
	if (diff !== 0) {
		switch (max) {
			case rNorm:
				hue = ((gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0)) / 6;
				break;
			case gNorm:
				hue = ((bNorm - rNorm) / diff + 2) / 6;
				break;
			case bNorm:
				hue = ((rNorm - gNorm) / diff + 4) / 6;
				break;
		}

	}

	hue = Math.round(hue * 360);
	saturation = Math.round(saturation * 100);
	const lightnessPercent = Math.round(lightness * 100);

	if (saturation < 10) {
		const grayNames = [
			{ min: 0, max: 5, name: 'Black' },
			{ min: 6, max: 15, name: 'Charcoal' },
			{ min: 16, max: 25, name: 'Dark Gray' },
			{ min: 26, max: 35, name: 'Graphite' },
			{ min: 36, max: 45, name: 'Slate' },
			{ min: 46, max: 55, name: 'Gray' },
			{ min: 56, max: 65, name: 'Stone' },
			{ min: 66, max: 75, name: 'Silver' },
			{ min: 76, max: 85, name: 'Light Gray' },
			{ min: 86, max: 92, name: 'Smoke' },
			{ min: 93, max: 97, name: 'Snow' },
			{ min: 98, max: 100, name: 'White' }
		];

		for (const gray of grayNames) {
			if (lightnessPercent >= gray.min && lightnessPercent <= gray.max) {
				return gray.name;
			}
		}
		return 'Gray';
	}

	const colorRanges = [
		{ min: 0, max: 10, base: ['Crimson', 'Dark Red', 'Maroon', 'Burgundy'] },
		{ min: 11, max: 20, base: ['Red', 'Cherry', 'Ruby', 'Scarlet'] },
		{ min: 21, max: 30, base: ['Coral', 'Salmon', 'Tomato', 'Rose'] },
		{ min: 31, max: 45, base: ['Orange', 'Tangerine', 'Rust', 'Copper'] },
		{ min: 46, max: 60, base: ['Peach', 'Apricot', 'Papaya', 'Sandy Brown'] },
		{ min: 61, max: 75, base: ['Yellow', 'Gold', 'Amber', 'Mustard'] },
		{ min: 76, max: 90, base: ['Lime', 'Chartreuse', 'Yellow Green', 'Spring Green'] },
		{ min: 91, max: 120, base: ['Green', 'Forest Green', 'Emerald', 'Jade'] },
		{ min: 121, max: 150, base: ['Teal', 'Turquoise', 'Sea Green', 'Pine'] },
		{ min: 151, max: 180, base: ['Cyan', 'Aqua', 'Turquoise', 'Light Sea Green'] },
		{ min: 181, max: 210, base: ['Sky Blue', 'Light Blue', 'Powder Blue', 'Steel Blue'] },
		{ min: 211, max: 240, base: ['Blue', 'Royal Blue', 'Navy', 'Midnight Blue'] },
		{ min: 241, max: 270, base: ['Purple', 'Violet', 'Indigo', 'Dark Violet'] },
		{ min: 271, max: 300, base: ['Magenta', 'Fuchsia', 'Orchid', 'Plum'] },
		{ min: 301, max: 330, base: ['Pink', 'Hot Pink', 'Deep Pink', 'Rose'] },
		{ min: 331, max: 360, base: ['Crimson', 'Red', 'Burgundy', 'Wine'] }
	];

	let baseName = 'Color';
	for (const range of colorRanges) {
		if (hue >= range.min && hue <= range.max) {
			const nameIndex = Math.min(
				Math.floor((saturation + lightnessPercent) / 50),
				range.base.length - 1
			);
			baseName = range.base[nameIndex];
			break;
		}
	}

	const modifiers = [];

	if (lightnessPercent < 15) {
		modifiers.push('Very Dark');
	} else if (lightnessPercent < 30) {
		modifiers.push('Dark');
	} else if (lightnessPercent > 90) {
		modifiers.push('Very Light');
	} else if (lightnessPercent > 75) {
		modifiers.push('Light');
	} else if (lightnessPercent > 60 && saturation < 40) {
		modifiers.push('Pale');
	}

	if (saturation > 85) {
		modifiers.push('Vivid');
	} else if (saturation > 70) {
		modifiers.push('Bright');
	} else if (saturation < 30) {
		modifiers.push('Muted');
	}

	const finalModifiers = modifiers.filter((mod, index, arr) => {
		if (mod === 'Dark' && arr.includes('Very Dark')) {
			return false;
		}
		if (mod === 'Light' && arr.includes('Very Light')) {
			return false;
		}
		return true;
	});

	return finalModifiers.length > 0 ? `${finalModifiers.join(' ')} ${baseName}` : baseName;
};

export default generateColorName;
