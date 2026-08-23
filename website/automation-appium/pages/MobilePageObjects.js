/**
 * Page Object Model for LifeLink Android App
 */
class MobileBasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async findElement(selector) {
    const el = await this.driver.$(selector);
    await el.waitForDisplayed({ timeout: 10000 });
    return el;
  }

  async click(selector) {
    const el = await this.findElement(selector);
    await el.click();
  }

  async setValue(selector, value) {
    const el = await this.findElement(selector);
    await el.clearValue();
    await el.setValue(value);
  }

  async getText(selector) {
    const el = await this.findElement(selector);
    return await el.getText();
  }
}

class MobileAuthPage extends MobileBasePage {
  get emailInput() { return 'id=org.lifelink.blooddonation:id/et_email'; }
  get passwordInput() { return 'id=org.lifelink.blooddonation:id/et_password'; }
  get loginButton() { return 'id=org.lifelink.blooddonation:id/btn_login'; }
  get registerButton() { return 'id=org.lifelink.blooddonation:id/btn_register'; }
  get errorMessage() { return 'id=org.lifelink.blooddonation:id/tv_error'; }

  async login(email, password) {
    await this.setValue(this.emailInput, email);
    await this.setValue(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}

class MobileEmergencySOSPage extends MobileBasePage {
  get sosButton() { return 'id=org.lifelink.blooddonation:id/btn_emergency_sos'; }
  get patientNameInput() { return 'id=org.lifelink.blooddonation:id/et_patient_name'; }
  get bloodGroupSpinner() { return 'id=org.lifelink.blooddonation:id/spinner_blood_group'; }
  get unitsNeededInput() { return 'id=org.lifelink.blooddonation:id/et_units_needed'; }
  get hospitalInput() { return 'id=org.lifelink.blooddonation:id/et_hospital'; }
  get broadcastSosBtn() { return 'id=org.lifelink.blooddonation:id/btn_broadcast_sos'; }
  get successBanner() { return 'id=org.lifelink.blooddonation:id/banner_success'; }

  async triggerEmergencySOS(data) {
    await this.setValue(this.patientNameInput, data.patientName);
    await this.setValue(this.hospitalInput, data.hospital);
    await this.setValue(this.unitsNeededInput, data.units.toString());
    await this.click(this.broadcastSosBtn);
  }
}

class MobileDonorSearchPage extends MobileBasePage {
  get bloodFilter() { return 'id=org.lifelink.blooddonation:id/filter_blood_group'; }
  get distanceFilter() { return 'id=org.lifelink.blooddonation:id/filter_radius_km'; }
  get searchButton() { return 'id=org.lifelink.blooddonation:id/btn_search_donors'; }
  get donorCards() { return 'id=org.lifelink.blooddonation:id/recycler_donors'; }

  async searchDonors(bloodGroup) {
    await this.click(this.bloodFilter);
    await this.click(this.searchButton);
  }
}

module.exports = {
  MobileBasePage,
  MobileAuthPage,
  MobileEmergencySOSPage,
  MobileDonorSearchPage
};
