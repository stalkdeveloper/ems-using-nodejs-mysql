const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'app.log');

const logger = {
    log: (message, details) => {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} INFO: ${typeof message === 'object' ? JSON.stringify(message) : message}` +
            (details ? ` - ${JSON.stringify(details)}` : '') + '\n';
        console.log(logMessage);
        fs.appendFileSync(logFilePath, logMessage);
    },
    error: (message) => {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} ERROR: ${typeof message === 'object' ? JSON.stringify(message) : message}\n`;
        console.error(logMessage);
        fs.appendFileSync(logFilePath, logMessage);
    }
};


// module.exports = logger;
global.logger = logger;

