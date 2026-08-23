import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// Custom Metrics
const responseTimeTrend = new Trend('custom_response_time');
const errorRate = new Rate('custom_error_rate');
const requestCounter = new Counter('custom_request_count');

// Test Configurations
export const options = {
  scenarios: {
    // 1. BASELINE LOAD TEST: 100 Virtual Users for 1 minute
    baseline_test: {
      executor: 'constant-vus',
      vus: 100,
      duration: '1m',
      startTime: '0s',
      tags: { scenario: 'baseline' },
    },
    // 2. SPIKE TEST: Sudden surge from 50 to 500 VUs
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 50,
      stages: [
        { duration: '10s', target: 50 },
        { duration: '15s', target: 500 }, // Spike!
        { duration: '30s', target: 500 }, // Hold spike
        { duration: '15s', target: 50 },  // Cool down
      ],
      startTime: '70s',
      tags: { scenario: 'spike' },
    },
    // 3. STRESS TEST: Progressive load 200 -> 500 -> 1000 users
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 100,
      stages: [
        { duration: '30s', target: 200 },
        { duration: '30s', target: 500 },
        { duration: '30s', target: 1000 },
        { duration: '20s', target: 0 },
      ],
      startTime: '150s',
      tags: { scenario: 'stress' },
    }
  },
  thresholds: {
    'http_req_duration{scenario:baseline}': ['p(95)<500', 'p(99)<1200', 'avg<250'],
    'http_req_failed': ['rate<0.05'], // < 5% errors
    'custom_error_rate': ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const headers = { 'Content-Type': 'application/json' };

  // 1. Health check baseline
  const healthRes = http.get(`${BASE_URL}/api/health`);
  check(healthRes, {
    'Health Check status is 200': (r) => r.status === 200,
    'Health Check DB connected': (r) => JSON.parse(r.body).ok === true,
  });
  responseTimeTrend.add(healthRes.timings.duration);
  errorRate.add(healthRes.status !== 200);
  requestCounter.add(1);

  // 2. Fetch public Donors list
  const donorsRes = http.get(`${BASE_URL}/api/donors`);
  check(donorsRes, {
    'Donors endpoint status is 200': (r) => r.status === 200,
    'Donors list is array': (r) => Array.isArray(JSON.parse(r.body).donors),
  });
  responseTimeTrend.add(donorsRes.timings.duration);
  errorRate.add(donorsRes.status !== 200);
  requestCounter.add(1);

  // 3. Fetch Emergency Requests
  const emergencyRes = http.get(`${BASE_URL}/api/emergency/requests`);
  check(emergencyRes, {
    'Emergency requests status is 200': (r) => r.status === 200,
  });
  responseTimeTrend.add(emergencyRes.timings.duration);
  errorRate.add(emergencyRes.status !== 200);
  requestCounter.add(1);

  // 4. Simulate User Authentication (Login)
  const loginPayload = JSON.stringify({
    email: 'donor@lifelink.org',
    password: 'password123',
    role: 'donor'
  });
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, { headers });
  check(loginRes, {
    'Login response status is 200 or 401': (r) => r.status === 200 || r.status === 401,
  });
  responseTimeTrend.add(loginRes.timings.duration);
  errorRate.add(loginRes.status >= 500);
  requestCounter.add(1);

  sleep(0.5); // 500ms pacing between iterative calls
}
