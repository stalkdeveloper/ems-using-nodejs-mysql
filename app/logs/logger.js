const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'app.log');

const logger = {
    log: (message, details) => {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} INFO: ${formatMessage(message)}` +
            (details ? ` - ${formatMessage(details)}` : '') + '\n';
        console.log(logMessage);
        fs.appendFileSync(logFilePath, logMessage);
    },
    error: (message) => {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} ERROR: ${formatMessage(message)}\n`;
        console.error(logMessage);
        fs.appendFileSync(logFilePath, logMessage);
    }
};

function formatMessage(message) {
    if (typeof message === 'object') {
        try {
            return JSON.stringify(message, getCircularReplacer(), 2);
        } catch (error) {
            return `[Error stringifying object: ${error.message}]`;
        }
    }
    return message;
}

function getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return '[Circular Reference]';
            }
            seen.add(value);
        }
        return value;
    };
}

// Assign the logger to a global variable
global.logger = logger;