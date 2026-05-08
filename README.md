<p align="center"><img width="350" src=".github/logo.svg"></p>

![BlaBlaBlocks Color Palette Block](https://raw.githubusercontent.com/lubusIN/color-palette-block/master/.wordpress-org/screenshot-1.gif)

[![Live Preview](https://img.shields.io/badge/Live%20Preview-3858e9?style=for-the-badge&logo=wordpress&logoColor=fff)](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/lubusIN/color-palette-block/master/_playground/blueprint-github.json) [![WordPress Plugin Version](https://img.shields.io/wordpress/plugin/v/color-palette-block?style=for-the-badge&logo=wordpress&label=Install&labelColor=blue)](https://wordpress.org/plugins/color-palette-block/)

## Overview

Build and share beautiful color palettes inside the WordPress block editor.

## Requirements

- WordPress 6.6+
- PHP 7.4+

## Installation

### Automatic

1. Go to Plugins → Add New in your WordPress dashboard.
2. Search for BlaBlaBlocks Color Palette Block.
3. Click Install Now and then Activate.

### Manual

1. [Download](https://wordpress.org/plugins/color-palette-block/) the latest plugin release.
2. Visit `Plugins > Add New`.
3. Upload the `color-palette-block.zip` file.
4. Activate **BlaBlaBlocks Color Palette Block** from the plugins page.

## Usage

### Core Workflow

- Add the **Color Palette** block from the block inserter.
- Add swatches manually, import theme colors, or generate random colors.
- Choose a display style: **Square**, **Polaroid**, **Circle**, or **Droplet**.
- Copy color values in **HEX**, **RGB**, **HSL**, or **CSS variable** format.

> [!NOTE]
> Refer to [readme.txt](readme.txt) for WordPress.org-specific plugin details and FAQs.

## Development

### 1. Clone the repository

```bash
git clone git@github.com:lubusIN/color-palette-block.git
```

### 2. Go to the plugin folder

```bash
cd color-palette-block
```

### 3. Install dependencies

```bash
npm install
```

### 4. Build plugin

```bash
npm run build       # Compile source files
# OR
npm run start       # Watch for changes and auto-compile
```

### 5. Launch Playground

```bash
npm run serve
```

> [!NOTE]
> Refer to `package.json` for additional npm scripts.

## Contributing

Contributions are welcome. Please review [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

- Feature requests / bugs: [Issues](https://github.com/lubusIN/color-palette-block/issues)
- Release notes: [CHANGELOG.md](CHANGELOG.md)

## Meet Your Artisans

[LUBUS](https://lubus.in/?utm_source=github&utm_medium=open-source&utm_campaign=color-palette-block) is a web design agency based in Mumbai.

<a href="https://cal.com/lubus">
	<img src="https://raw.githubusercontent.com/lubusIN/.github/refs/heads/main/profile/banner.png" />
</a>

## License

BlaBlaBlocks Color Palette Block is an open-source plugin licensed under the [GPL 3.0 license](LICENSE)
