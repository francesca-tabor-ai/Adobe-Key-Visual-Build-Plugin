# KV Build Engine

KV Build Engine is a Photoshop UXP plugin that automatically generates a fully structured, automation-ready `KV_Master_Project.psd` from a validated JSON specification.

## Features

- **Document Creation Engine**: Automatically sets up documents with specific dimensions, resolution, and color profiles.
- **Layer Architecture Generator**: Builds the standard 00–08 folder structure for KV projects.
- **Smart Object Placeholder Engine**: Creates named Smart Object placeholders for backgrounds and products.
- **Safe Zone Builder**: Generates vector-based safe zone guides for various social and display formats.
- **Export Preset Engine**: Automatically creates artboards for 9+ standard export sizes.
- **JSON Spec Parser**: Validates incoming build specifications.

## Installation

1.  Open Adobe Photoshop (v22 or newer).
2.  Open the **Adobe UXP Developer Tool**.
3.  Click **Add Plugin** and select the `manifest.json` file in this directory.
4.  Click **Load** to start the plugin in Photoshop.

## Usage

1.  Open the KV Build Engine panel in Photoshop.
2.  Paste a valid KV JSON specification into the text area.
3.  Click **Import JSON Spec**.
4.  Click **Create Master File** to build the initial PSD structure.
5.  Click **Generate Artboards** to create all required export sizes.
6.  Click **Save As Master** to finalize the project.

## Sample JSON Spec

```json
{
  "document": {
    "width": 1080,
    "height": 1080,
    "resolution": 72,
    "colorMode": "RGB",
    "colorProfile": "sRGB IEC61966-2.1"
  },
  "smartObjects": [
    { "name": "BG_SMART", "group": "01_BACKGROUND" },
    { "name": "PRODUCT_SMART", "group": "02_PRODUCT" }
  ]
}
```

## Project Structure

- `manifest.json`: Plugin configuration.
- `index.html`: Plugin UI.
- `main.js`: Main logic and UI interaction.
- `engines/`: Core logic for document, layer, smart object, guide, and export generation.
- `utils/`: Validation and logging utilities.
# Adobe-Key-Visual-Build-Plugin
