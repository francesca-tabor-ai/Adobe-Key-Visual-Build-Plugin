const { app, core } = require("photoshop");

/**
 * Creates Smart Object placeholders inside specified groups.
 * @param {Document} doc - The Photoshop document.
 * @param {Object} spec - The JSON specification.
 */
async function createSmartObjectPlaceholders(doc, spec) {
    const { smartObjects = [
        { name: "BG_SMART", group: "01_BACKGROUND" },
        { name: "PRODUCT_SMART", group: "02_PRODUCT" }
    ] } = spec;

    for (const soDef of smartObjects) {
        const { name, group: groupName } = soDef;
        const group = doc.layers.find(layer => layer.name === groupName && layer.kind === "group");

        if (group) {
            try {
                // In UXP, creating a Smart Object often involves creating a layer and then converting it.
                // However, there's no direct `createSmartObject` method. 
                // A common way is to create a new layer, select it, and use batchPlay to convert it.
                
                // Create a temporary pixel layer
                const tempLayer = await group.createLayer({
                    name: name,
                    opacity: 100,
                    mode: "normal"
                });

                // Select the layer to prepare for batchPlay
                tempLayer.selected = true;

                // Use batchPlay to convert the selected layer to a Smart Object
                await core.executeAsModal(async () => {
                    await app.batchPlay([
                        {
                            _obj: "newPlacedLayer",
                            _target: [{ _ref: "layer", _enum: "ordinal", _value: "targetEnum" }]
                        }
                    ], {});
                }, { commandName: "Convert to Smart Object" });

                // Rename it back just in case
                const currentLayer = app.activeDocument.activeLayers[0];
                currentLayer.name = name;

            } catch (error) {
                console.error(`Error creating Smart Object ${name}:`, error);
            }
        } else {
            console.warn(`Group ${groupName} not found for Smart Object ${name}.`);
        }
    }
}

module.exports = { createSmartObjectPlaceholders };
