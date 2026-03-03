const { app, core } = require("photoshop");

/**
 * Creates safe zone guides as vector shapes in the 00_GUIDES group.
 * @param {Document} doc - The Photoshop document.
 * @param {Object} spec - The JSON specification.
 */
async function createSafeZoneGuides(doc, spec) {
    const { width, height } = doc;
    const guidesGroup = doc.layers.find(layer => layer.name === "00_GUIDES" && layer.kind === "group");

    if (!guidesGroup) {
        console.error("Guides group not found.");
        return;
    }

    const safeZones = [
        { name: "Core 1080x1080", width: 1080, height: 1080, color: { r: 0, g: 255, b: 0 }, opacity: 20 },
        { name: "Vertical Extension", width: 1080, height: 1920, color: { r: 255, g: 255, b: 0 }, opacity: 10 },
        { name: "Horizontal Extension", width: 1920, height: 1080, color: { r: 255, g: 0, b: 255 }, opacity: 10 },
        { name: "Banner Crop", width: 1200, height: 628, color: { r: 0, g: 255, b: 255 }, opacity: 15 }
    ];

    for (const zone of safeZones) {
        try {
            // Create a rectangle for each safe zone centered in the document
            const left = (width - zone.width) / 2;
            const top = (height - zone.height) / 2;
            const right = left + zone.width;
            const bottom = top + zone.height;

            // Use batchPlay to create a shape layer
            await core.executeAsModal(async () => {
                await app.batchPlay([
                    {
                        _obj: "make",
                        _target: [{ _ref: "contentLayer" }],
                        using: {
                            _obj: "contentLayer",
                            type: {
                                _obj: "solidColorLayer",
                                color: {
                                    _obj: "RGBColor",
                                    red: zone.color.r,
                                    grain: zone.color.g,
                                    blue: zone.color.b
                                }
                            },
                            shape: {
                                _obj: "rectangle",
                                unitValueUnit: "pixelsUnit",
                                top: top,
                                left: left,
                                bottom: bottom,
                                right: right
                            }
                        }
                    }
                ], {});
            }, { commandName: `Create ${zone.name} Guide` });

            // The new layer is now active, move it into the guides group
            const newLayer = app.activeDocument.activeLayers[0];
            newLayer.name = zone.name;
            newLayer.opacity = zone.opacity;
            // newLayer.locked = true; // Optionally lock the guide layers
            // Move it into the guides group (in UXP this can be done via parent assignment)
            // Wait, doc.layers is a collection, let's move it to the guides group.
            // Move layer to the guides group
            await core.executeAsModal(async () => {
                await app.batchPlay([
                    {
                        _obj: "move",
                        _target: [{ _ref: "layer", _enum: "ordinal", _value: "targetEnum" }],
                        to: { _ref: "layer", _name: "00_GUIDES" },
                        adjustment: false,
                        version: 5,
                        _options: { dialogOptions: "dontDisplay" }
                    }
                ], {});
            }, { commandName: "Move to Guides Group" });

        } catch (error) {
            console.error(`Error creating guide ${zone.name}:`, error);
        }
    }
}

module.exports = { createSafeZoneGuides };
