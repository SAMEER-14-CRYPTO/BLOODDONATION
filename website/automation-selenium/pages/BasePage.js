const { By, until } = require('selenium-webdriver');

class BasePage {
  constructor(driver, config) {
    this.driver = driver;
    this.config = config;
  }

  async navigateTo(path = '') {
    const url = `${this.config.baseUrl}/${path}`.replace(/([^:]\/)\/+/g, "$1");
    await this.driver.get(url);
  }

  async waitForElement(locator, timeout = 10000) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async waitForVisible(locator, timeout = 10000) {
    const el = await this.waitForElement(locator, timeout);
    await this.driver.wait(until.elementIsVisible(el), timeout);
    return el;
  }

  async click(locator) {
    const el = await this.waitForVisible(locator);
    await el.click();
  }

  async type(locator, text) {
    const el = await this.waitForVisible(locator);
    await el.clear();
    await el.sendKeys(text);
  }

  async getText(locator) {
    const el = await this.waitForVisible(locator);
    return await el.getText();
  }

  async isDisplayed(locator) {
    try {
      const el = await this.waitForVisible(locator, 3000);
      return await el.isDisplayed();
    } catch {
      return false;
    }
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  async executeScript(script, ...args) {
    return await this.driver.executeScript(script, ...args);
  }
}

module.exports = BasePage;
