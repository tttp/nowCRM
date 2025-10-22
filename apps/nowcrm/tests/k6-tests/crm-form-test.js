import http from 'k6/http';
import { check, sleep } from 'k6';

const VUS = __ENV.VUS ? parseInt(__ENV.VUS) : 100; // Default to 100 VUs if not set

export const options = {
    stages: [
        { duration: '30s', target: Math.floor(VUS / 2) }, // Ramp up to half of VUS
        { duration: '1m', target: VUS },                  // Stay at VUS
        { duration: '30s', target: 0 },                   // Ramp down to 0 VUs
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1000ms
        http_req_failed: ['rate<0.01'],    // Less than 1% failed requests
    },
    cloud: {
        name: 'CRM Public Form Load Test',
        // Optionally set your k6 Cloud project ID:
        // projectID: 1234567,
    },
};

export default function () {
    const res = http.get('https://crm-test.nowtec.solutions/forms/share/qa-form');
    check(res, {
        'status is 200': (r) => r.status === 200,
        'body is not empty': (r) => r.body && r.body.length > 0,
    });
    sleep(1); // Simulate user think time
}