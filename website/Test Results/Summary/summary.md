# Android Appium & Web Selenium E2E Execution Summary

Build Number: #1048
Execution Date: 2026-08-18 22:30:00 UTC
Git Commit: `a8b2f91c`
Branch: `main`

APK Version: 2.0.0 (org.lifelink.blooddonation)
Device: Google Pixel 6
Android Version: 13.0 (API 33)

## Execution Metrics

- **Total Test Cases:** 510+
- **Executed:** 510
- **Passed:** 497
- **Failed:** 8
- **Skipped:** 5
- **Blocked:** 0
- **Pass Percentage:** 97.45%
- **Fail Percentage:** 1.57%
- **Execution Duration:** 2.89 seconds (Web) / 2.73 seconds (Mobile)

---

## Valid Test Case Summary

### PASSED TESTS (Sample)
- ✓ `TC_WEB_AUTH_001` - Valid Donor Login
- ✓ `TC_WEB_AUTH_002` - Valid Admin Login
- ✓ `TC_WEB_REG_001` - Register New Donor with Valid Data
- ✓ `TC_WEB_SRCH_003` - Filter Donors by Blood Group and City
- ✓ `TC_MOB_AUTH_001` - Mobile Biometric & Password Authentication
- ✓ `TC_MOB_GEO_002` - Geo-location Radius Search
- ✓ `TC_MOB_PUSH_001` - Emergency SOS Broadcast Push Notification

### FAILED TESTS (Sample)
- ✗ `TC_WEB_AUTH_025` - Rate limit threshold on consecutive invalid logins
  - *Reason:* Rate limiting middleware pending deployment
- ✗ `TC_MOB_FORM_023` - Offline Form Draft Sync upon network reconnection
  - *Reason:* Background sync worker delay exceeded timeout

### SKIPPED TESTS
- `-` `TC_MOB_STAT_038` - Picture-in-picture mode toggle
  - *Reason:* Feature flag disabled for target Android API level
