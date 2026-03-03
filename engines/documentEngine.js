const { app } = require("photoshop");

/**
 * Creates a new Photoshop document based on the provided spec.
 * @param {Object} spec - The JSON specification.
 * @returns {Promise<Document>}
 */
async function createDocument(spec) {
    const {
        width = 1080,
        height = 1080,
        resolution = 72,
        colorMode = "RGB",
        colorProfile = "sRGB IEC61966-2.1",
        fill = "transparent"
    } = spec.document || {};

    try {
        const doc = await app.createDocument({
            width,
            height,
            resolution,
            mode: colorMode,
            profile: colorProfile,
            fill: fill === "transparent" ? "transparent" : "white"
        });
        return doc;
    } catch (error) {
        console.error("Error creating document:", error);
        throw error;
    }
}

module.exports = { createDocument };
