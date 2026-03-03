/**
 * Simple logger for the KV Build Engine.
 */
class Logger {
    constructor() {
        this.logs = [];
    }

    info(message) {
        this._log("INFO", message);
    }

    warn(message) {
        this._log("WARN", message);
    }

    error(message) {
        this._log("ERROR", message);
    }

    _log(level, message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level}] ${message}`;
        this.logs.push(logEntry);
        console.log(logEntry);
    }

    getLogs() {
        return this.logs;
    }

    clear() {
        this.logs = [];
    }
}

const logger = new Logger();
module.exports = { logger };
