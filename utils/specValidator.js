/**
 * Validates the JSON specification for the KV Build Engine.
 * @param {Object} spec - The JSON specification.
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
function validateSpec(spec) {
    const errors = [];

    if (!spec) {
        errors.push("Spec is empty or not valid JSON.");
        return { isValid: false, errors };
    }

    // Check for required sections
    if (!spec.document) {
        errors.push("Missing 'document' section.");
    } else {
        const { width, height } = spec.document;
        if (!width || typeof width !== "number") errors.push("Invalid or missing 'document.width'.");
        if (!height || typeof height !== "number") errors.push("Invalid or missing 'document.height'.");
    }

    // Optional sections validation
    if (spec.layers && !Array.isArray(spec.layers)) {
        errors.push("'layers' section must be an array.");
    }

    if (spec.smartObjects && !Array.isArray(spec.smartObjects)) {
        errors.push("'smartObjects' section must be an array.");
    }

    if (spec.exportSizes && !Array.isArray(spec.exportSizes)) {
        errors.push("'exportSizes' section must be an array.");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

module.exports = { validateSpec };
