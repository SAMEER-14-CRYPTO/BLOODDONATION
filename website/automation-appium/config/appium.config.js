/**
 * Appium Android Mobile Automation Configuration
 */
const path = require('path');

module.exports = {
  server: {
    host: process.env.APPIUM_HOST || '127.0.0.1',
    port: parseInt(process.env.APPIUM_PORT) || 4723,
    path: '/'
  },
  capabilities: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Pixel_6_API_33',
    'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION || '13.0',
    'appium:app': process.env.APP_PATH || path.join(__dirname, '../resources/LifeLink-v2.0-debug.apk'),
    'appium:appPackage': 'org.lifelink.blooddonation',
    'appium:appActivity': 'org.lifelink.blooddonation.MainActivity',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 300
  },
  paths: {
    screenshots: path.join(__dirname, '../screenshots'),
    reports: path.join(__dirname, '../reports'),
    logs: path.join(__dirname, '../logs'),
    data: path.join(__dirname, '../data')
  },
  timeouts: {
    implicit: 10000,
    pageLoad: 30000,
    command: 60000
  }
};
