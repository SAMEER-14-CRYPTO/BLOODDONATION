const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(driver, config) {
    super(driver, config);
    this.emailInput = By.id('email');
    this.passwordInput = By.id('password');
    this.submitBtn = By.css('button[type="submit"]');
    this.donorTab = By.id('donorTab') || By.xpath("//button[contains(text(),'Donor')]");
    this.adminTab = By.id('adminTab') || By.xpath("//button[contains(text(),'Admin')]");
    this.errorMessage = By.className('error-msg');
    this.registerLink = By.linkText('Register here');
  }

  async open() {
    await this.navigateTo('login.html');
  }

  async login(email, password) {
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.click(this.submitBtn);
  }

  async switchTab(tab = 'donor') {
    if (tab === 'admin') {
      await this.click(this.adminTab);
    } else {
      await this.click(this.donorTab);
    }
  }
}

class RegisterPage extends BasePage {
  constructor(driver, config) {
    super(driver, config);
    this.fullNameInput = By.id('fullName');
    this.emailInput = By.id('email');
    this.passwordInput = By.id('password');
    this.phoneInput = By.id('phone');
    this.bloodGroupSelect = By.id('bloodGroup');
    this.cityInput = By.id('city');
    this.ageInput = By.id('age');
    this.submitBtn = By.css('button[type="submit"]');
  }

  async open() {
    await this.navigateTo('register.html');
  }

  async registerUser(userData) {
    if (userData.fullName) await this.type(this.fullNameInput, userData.fullName);
    if (userData.email) await this.type(this.emailInput, userData.email);
    if (userData.password) await this.type(this.passwordInput, userData.password);
    if (userData.phone) await this.type(this.phoneInput, userData.phone);
    if (userData.city) await this.type(this.cityInput, userData.city);
    if (userData.age) await this.type(this.ageInput, userData.age.toString());
    await this.click(this.submitBtn);
  }
}

class EmergencyPage extends BasePage {
  constructor(driver, config) {
    super(driver, config);
    this.patientName = By.id('patientName');
    this.bloodGroup = By.id('bloodGroupNeeded');
    this.units = By.id('unitsNeeded');
    this.hospital = By.id('hospitalName');
    this.location = By.id('location');
    this.urgency = By.id('urgencyLevel');
    this.submitBtn = By.id('submitEmergencyBtn');
    this.activeRequestsList = By.id('requestsContainer');
  }

  async open() {
    await this.navigateTo('emergency.html');
  }

  async submitEmergencyRequest(data) {
    if (data.patientName) await this.type(this.patientName, data.patientName);
    if (data.hospital) await this.type(this.hospital, data.hospital);
    if (data.location) await this.type(this.location, data.location);
    if (data.units) await this.type(this.units, data.units.toString());
    await this.click(this.submitBtn);
  }
}

class SearchPage extends BasePage {
  constructor(driver, config) {
    super(driver, config);
    this.bloodGroupFilter = By.id('bloodGroupFilter');
    this.cityFilter = By.id('cityFilter');
    this.searchBtn = By.id('searchBtn');
    this.donorList = By.id('donorsContainer');
  }

  async open() {
    await this.navigateTo('search.html');
  }

  async filterDonors(group, city) {
    if (group) await this.type(this.bloodGroupFilter, group);
    if (city) await this.type(this.cityFilter, city);
    await this.click(this.searchBtn);
  }
}

class DashboardPage extends BasePage {
  constructor(driver, config) {
    super(driver, config);
    this.statsCards = By.className('stat-card');
    this.quickDonateBtn = By.id('quickDonateBtn');
    this.userGreeting = By.id('userGreeting');
  }

  async open() {
    await this.navigateTo('dashboard.html');
  }
}

class ProfilePage extends BasePage {
  constructor(driver, config) {
    super(driver, config);
    this.profileName = By.id('profileName');
    this.editProfileBtn = By.id('editProfileBtn');
    this.saveProfileBtn = By.id('saveProfileBtn');
  }

  async open() {
    await this.navigateTo('profile.html');
  }
}

class AdminPage extends BasePage {
  constructor(driver, config) {
    super(driver, config);
    this.userTable = By.id('usersTable');
    this.emergencyTable = By.id('emergencyTable');
    this.exportReportBtn = By.id('exportReportBtn');
  }

  async open() {
    await this.navigateTo('admin.html');
  }
}

module.exports = {
  LoginPage,
  RegisterPage,
  EmergencyPage,
  SearchPage,
  DashboardPage,
  ProfilePage,
  AdminPage
};
