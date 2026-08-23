const fs = require('fs');
const path = require('path');

class Logger {
  constructor(logDir = path.join(__dirname, '../logs')) {
    this.logDir = logDir;
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    this.logFile = path.join(this.logDir, `execution-${new Date().toISOString().replace(/[:.]/g, '-')}.log`);
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level}] ${message}`;
    console.log(formatted);
    fs.appendFileSync(this.logFile, formatted + '\n');
  }

  info(msg) { this.log(msg, 'INFO'); }
  warn(msg) { this.log(msg, 'WARN'); }
  error(msg) { this.log(msg, 'ERROR'); }
  debug(msg) { this.log(msg, 'DEBUG'); }
}

module.exports = new Logger();
