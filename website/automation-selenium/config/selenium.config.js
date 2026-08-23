/**
 * Selenium Automation Configuration for LifeLink Web Application
 */
const path = require('path');

module.exports = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  browser: process.env.BROWSER || 'chrome',
  headless: process.env.HEADLESS === 'true',
  implicitTimeout: 10000,
  pageLoadTimeout: 30000,
  scriptTimeout: 30000,
  paths: {
    screenshots: path.join(__dirname, '../screenshots'),
    reports: path.join(__dirname, '../reports'),
    logs: path.join(__dirname, '../logs'),
    data: path.join(__dirname, '../data')
  },
  retryAttempts: 2,
  thresholds: {
    maxResponseTimeMs: 2000,
    minPassPercentage: 95
  }
};
