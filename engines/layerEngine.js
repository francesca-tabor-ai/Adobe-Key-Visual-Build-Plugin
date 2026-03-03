const { app } = require("photoshop");

const TOP_LEVEL_GROUPS = [
    "00_GUIDES",
    "01_BACKGROUND",
    "02_PRODUCT",
    "03_BRAND",
    "04_FLAVOR",
    "05_PRICING",
    "06_PROMO",
    "07_BADGES",
    "08_REGULATORY"
];

/**
 * Builds the standard layer architecture for the KV Master Project.
 * @param {Document} doc - The Photoshop document.
 * @param {Object} spec - The JSON specification.
 */
async function buildLayerArchitecture(doc, spec) {
    // Reverse the groups so they appear in the correct order (top to bottom)
    // in the Layers panel when created sequentially.
    const groupsToCreate = [...TOP_LEVEL_GROUPS].reverse();

    for (const groupName of groupsToCreate) {
        try {
            await doc.createLayerGroup({
                name: groupName,
                opacity: 100,
                mode: "passThrough"
            });
        } catch (error) {
            console.error(`Error creating group ${groupName}:`, error);
        }
    }

    // Handle nested children from spec if any
    if (spec.layers && Array.isArray(spec.layers)) {
        for (const layerDef of spec.layers) {
            await createLayerFromDef(doc, layerDef);
        }
    }
}

/**
 * Creates a layer or group based on a definition object.
 * @param {Document|LayerGroup} parent - The parent document or group.
 * @param {Object} def - The layer definition.
 */
async function createLayerFromDef(parent, def) {
    const { name, type, children } = def;
    
    if (type === "group") {
        const group = await parent.createLayerGroup({ name });
        if (children && Array.isArray(children)) {
            for (const childDef of children) {
                await createLayerFromDef(group, childDef);
            }
        }
    } else {
        // Placeholder for other layer types if needed
    }
}

module.exports = { buildLayerArchitecture };
