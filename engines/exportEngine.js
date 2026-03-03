const { app, core } = require("photoshop");

const EXPORT_SIZES = [
    { name: "Social_1080x1080", width: 1080, height: 1080 },
    { name: "Social_1080x1350", width: 1080, height: 1350 },
    { name: "Social_1080x1920", width: 1080, height: 1920 },
    { name: "Display_300x250", width: 300, height: 250 },
    { name: "Display_728x90", width: 728, height: 90 },
    { name: "Display_160x600", width: 160, height: 600 },
    { name: "Display_300x600", width: 300, height: 600 },
    { name: "Ecommerce_2000x2000", width: 2000, height: 2000 },
    { name: "Ecommerce_1200x628", width: 1200, height: 628 }
];

/**
 * Generates export artboards for the KV Master Project.
 * @param {Document} doc - The Photoshop document.
 * @param {Object} spec - The JSON specification.
 */
async function generateExportArtboards(doc, spec) {
    const { exportSizes = EXPORT_SIZES } = spec;

    // First, save the master layout as a linked Smart Object
    // For MVP, we'll assume the master layout is everything except the 00_GUIDES group.
    // However, creating a linked SO of the current document is tricky without saving first.
    // So we'll create artboards and put a copy of the layers in them for now.
    
    // In a real implementation, we'd save the master file and then place it as a linked SO.
    // Since we're just setting up the structure, we'll create the artboards and place a 
    // placeholder inside them.

    let xOffset = doc.width + 500;
    let yOffset = 0;
    let rowHeight = 0;

    for (const size of exportSizes) {
        try {
            await core.executeAsModal(async () => {
                // Create an artboard using batchPlay
                await app.batchPlay([
                    {
                        _obj: "make",
                        _target: [{ _ref: "artboardSection" }],
                        using: {
                            _obj: "artboardSection",
                            name: size.name,
                            artboardRect: {
                                _obj: "classFloatRect",
                                top: yOffset,
                                left: xOffset,
                                bottom: yOffset + size.height,
                                right: xOffset + size.width
                            }
                        }
                    }
                ], {});

                // Update offsets for the next artboard
                xOffset += size.width + 500;
                rowHeight = Math.max(rowHeight, size.height);
                if (xOffset > 10000) { // Wrap to next row
                    xOffset = doc.width + 500;
                    yOffset += rowHeight + 500;
                    rowHeight = 0;
                }

                // Add a placeholder layer in the artboard
                const currentArtboard = app.activeDocument.activeLayers[0];
                const placeholder = await currentArtboard.createLayer({
                    name: "MASTER_LINKED_PLACEHOLDER",
                    opacity: 100,
                    mode: "normal"
                });
                
            }, { commandName: `Create Artboard ${size.name}` });

        } catch (error) {
            console.error(`Error creating artboard ${size.name}:`, error);
        }
    }
}

module.exports = { generateExportArtboards };
