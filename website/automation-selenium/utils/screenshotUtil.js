const fs = require('fs');
const path = require('path');

class ScreenshotUtil {
  constructor(screenshotDir = path.join(__dirname, '../screenshots')) {
    this.screenshotDir = screenshotDir;
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async capture(driver, testName) {
    try {
      const sanitized = testName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${sanitized}_${Date.now()}.png`;
      const filePath = path.join(this.screenshotDir, filename);
      const data = await driver.takeScreenshot();
      fs.writeFileSync(filePath, data, 'base64');
      return filePath;
    } catch (err) {
      console.error('Failed to capture screenshot:', err.message);
      return null;
    }
  }
}

module.exports = new ScreenshotUtil();
