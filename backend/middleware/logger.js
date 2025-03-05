const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "logs.txt");

const logger = (req, res, next) => {
    const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error("Error writing to log file", err);
        }
    });
    console.log(logMessage.trim());
    next();
};

module.exports = logger;
