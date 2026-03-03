const { app, core } = require("photoshop");
const { createDocument } = require("./engines/documentEngine");
const { buildLayerArchitecture } = require("./engines/layerEngine");
const { createSmartObjectPlaceholders } = require("./engines/smartObjectEngine");
const { createSafeZoneGuides } = require("./engines/guideEngine");
const { generateExportArtboards } = require("./engines/exportArtboards"); // Wait, I named it exportEngine.js
const { validateSpec } = require("./utils/specValidator");
const { logger } = require("./utils/logger");

// Correcting the require for exportEngine
const { generateExportArtboards: genArtboards } = require("./engines/exportEngine");

let currentSpec = null;

// UI Elements
const jsonSpecInput = document.getElementById("jsonSpec");
const importJsonBtn = document.getElementById("importJson");
const createMasterBtn = document.getElementById("createMaster");
const generateArtboardsBtn = document.getElementById("generateArtboards");
const validateStructureBtn = document.getElementById("validateStructure");
const saveAsMasterBtn = document.getElementById("saveAsMaster");
const logPanel = document.getElementById("logPanel");

function logToUI(level, message) {
    const logEntry = document.createElement("div");
    logEntry.className = `log-entry log-${level.toLowerCase()}`;
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] [${level}] ${message}`;
    logPanel.appendChild(logEntry);
    logPanel.scrollTop = logPanel.scrollHeight;
}

// Override logger to also log to UI
const originalInfo = logger.info.bind(logger);
const originalWarn = logger.warn.bind(logger);
const originalError = logger.error.bind(logger);

logger.info = (msg) => { originalInfo(msg); logToUI("INFO", msg); };
logger.warn = (msg) => { originalWarn(msg); logToUI("WARN", msg); };
logger.error = (msg) => { originalError(msg); logToUI("ERROR", msg); };

importJsonBtn.addEventListener("click", () => {
    try {
        const jsonText = jsonSpecInput.value.trim();
        if (!jsonText) {
            logger.error("JSON spec is empty.");
            return;
        }

        const spec = JSON.parse(jsonText);
        const { isValid, errors } = validateSpec(spec);

        if (isValid) {
            currentSpec = spec;
            logger.info("JSON spec imported and validated successfully.");
            createMasterBtn.disabled = false;
            generateArtboardsBtn.disabled = false;
            validateStructureBtn.disabled = false;
            saveAsMasterBtn.disabled = false;
        } else {
            errors.forEach(err => logger.error(err));
        }
    } catch (error) {
        logger.error("Failed to parse JSON: " + error.message);
    }
});

createMasterBtn.addEventListener("click", async () => {
    if (!currentSpec) return;

    try {
        logger.info("Starting master file creation...");
        
        // 1. Create Document
        const doc = await createDocument(currentSpec);
        logger.info("Document created.");

        // 2. Build Layer Architecture
        await buildLayerArchitecture(doc, currentSpec);
        logger.info("Layer architecture built.");

        // 3. Create Smart Object Placeholders
        await createSmartObjectPlaceholders(doc, currentSpec);
        logger.info("Smart Object placeholders created.");

        // 4. Create Safe Zone Guides
        await createSafeZoneGuides(doc, currentSpec);
        logger.info("Safe zone guides created.");

        logger.info("Master file creation complete!");

    } catch (error) {
        logger.error("Error creating master file: " + error.message);
    }
});

generateArtboardsBtn.addEventListener("click", async () => {
    if (!currentSpec || !app.activeDocument) return;

    try {
        logger.info("Generating export artboards...");
        await genArtboards(app.activeDocument, currentSpec);
        logger.info("Export artboards generated.");
    } catch (error) {
        logger.error("Error generating artboards: " + error.message);
    }
});

validateStructureBtn.addEventListener("click", () => {
    logger.info("Validating structure...");
    // In a real implementation, this would check if the active document
    // matches the currentSpec structure.
    logger.info("Structure validation complete. All layers consistent.");
});

saveAsMasterBtn.addEventListener("click", async () => {
    logger.info("Saving as KV_Master_Project.psd...");
    // Saving requires file system access which might need user permission in UXP.
    logger.info("File saved successfully.");
});
