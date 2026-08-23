const { remote } = require('webdriverio');
const config = require('../config/appium.config');

class DriverManager {
  constructor() {
    this.driver = null;
  }

  async initDriver(customCaps = {}) {
    const opts = {
      hostname: config.server.host,
      port: config.server.port,
      path: config.server.path,
      capabilities: {
        ...config.capabilities,
        ...customCaps
      }
    };
    this.driver = await remote(opts);
    await this.driver.setTimeout({ implicit: config.timeouts.implicit });
    return this.driver;
  }

  async quitDriver() {
    if (this.driver) {
      await this.driver.deleteSession();
      this.driver = null;
    }
  }

  getDriver() {
    return this.driver;
  }
}

module.exports = new DriverManager();
