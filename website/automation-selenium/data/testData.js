/**
 * Test Data Framework for Selenium Web Automation
 */
module.exports = {
  validUsers: [
    { email: 'donor@lifelink.org', password: 'password123', fullName: 'Rahul Sharma', role: 'donor', bloodGroup: 'O+', city: 'Mumbai' },
    { email: 'admin@lifelink.org', password: 'adminpassword123', fullName: 'System Admin', role: 'admin', adminCode: 'ADMIN-SECURE', city: 'Delhi' },
    { email: 'priya.patel@gmail.com', password: 'securePass2026', fullName: 'Priya Patel', role: 'donor', bloodGroup: 'A+', city: 'Bangalore' },
    { email: 'vikram.singh@yahoo.com', password: 'passVikram!9', fullName: 'Vikram Singh', role: 'donor', bloodGroup: 'B-', city: 'Pune' }
  ],
  invalidUsers: [
    { email: 'invalid.email', password: '123', expectedError: 'Email, password, and full name are required.' },
    { email: 'nonexistent@lifelink.org', password: 'wrongPassword', expectedError: 'Invalid email or password.' },
    { email: 'shortpass@lifelink.org', password: '123', expectedError: 'Password must be at least 6 characters.' }
  ],
  bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'],
  emergencyRequests: [
    { patientName: 'Amit Verma', bloodGroupNeeded: 'O-', unitsNeeded: 3, hospitalName: 'Apollo Hospital', location: 'Mumbai Central', urgencyLevel: 'critical' },
    { patientName: 'Sneha Reddy', bloodGroupNeeded: 'B+', unitsNeeded: 2, hospitalName: 'Fortis Healthcare', location: 'Bangalore South', urgencyLevel: 'high' },
    { patientName: 'Mohammed Khan', bloodGroupNeeded: 'AB+', unitsNeeded: 1, hospitalName: 'Max Super Speciality', location: 'Delhi NCR', urgencyLevel: 'medium' }
  ],
  securityPayloads: [
    { type: 'SQLi', payload: "' OR '1'='1" },
    { type: 'XSS', payload: "<script>alert('xss')</script>" },
    { type: 'PathTraversal', payload: '../../../../etc/passwd' },
    { type: 'BufferOverflow', payload: 'A'.repeat(5000) }
  ]
};
