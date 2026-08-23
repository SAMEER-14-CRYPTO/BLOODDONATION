/**
 * Test Data Framework for Selenium Web Automation
 */
module.exports = {
  validUsers: [
    { email: 'donor@lifelink.org', password: 'password123', fullName: 'Karthik Iyer', role: 'donor', bloodGroup: 'O+', city: 'Chennai' },
    { email: 'sameeradmin@lifelink.com', password: 'Sameer@14', fullName: 'Sameer Admin', role: 'admin', city: 'Rly Kodur' },
    { email: 'priya.lakshmi@gmail.com', password: 'securePass2026', fullName: 'Priya Lakshmi', role: 'donor', bloodGroup: 'A+', city: 'Coimbatore' },
    { email: 'vikram.reddy@yahoo.com', password: 'passVikram!9', fullName: 'Vikram Reddy', role: 'donor', bloodGroup: 'B-', city: 'Tirupati' }
  ],
  invalidUsers: [
    { email: 'invalid.email', password: '123', expectedError: 'Email, password, and full name are required.' },
    { email: 'nonexistent@lifelink.org', password: 'wrongPassword', expectedError: 'Invalid email or password.' },
    { email: 'shortpass@lifelink.org', password: '123', expectedError: 'Password must be at least 6 characters.' }
  ],
  bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  cities: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirupati', 'Vijayawada', 'Visakhapatnam', 'Guntur', 'Nellore', 'Kurnool', 'Kadapa', 'Rly Kodur'],
  emergencyRequests: [
    { patientName: 'Deepak Naidu', bloodGroupNeeded: 'O-', unitsNeeded: 3, hospitalName: 'Apollo Hospitals Chennai', location: 'Chennai', urgencyLevel: 'critical' },
    { patientName: 'Sneha Reddy', bloodGroupNeeded: 'B+', unitsNeeded: 2, hospitalName: 'SVIMS Hospital Tirupati', location: 'Tirupati', urgencyLevel: 'high' },
    { patientName: 'Mohammed Rafi', bloodGroupNeeded: 'AB+', unitsNeeded: 1, hospitalName: 'Andhra Hospitals Vijayawada', location: 'Vijayawada', urgencyLevel: 'medium' }
  ],
  securityPayloads: [
    { type: 'SQLi', payload: "' OR '1'='1" },
    { type: 'XSS', payload: "<script>alert('xss')</script>" },
    { type: 'PathTraversal', payload: '../../../../etc/passwd' },
    { type: 'BufferOverflow', payload: 'A'.repeat(5000) }
  ]
};
