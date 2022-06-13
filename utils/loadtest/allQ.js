import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const url = 'http://localhost:8000/qa';

export const requests = new Counter('http_reqs');

const generateRandomProductId = () => {
  return Math.floor((Math.random() * 1000011 + 1));
}

export const failures = new Rate('failed_requests');

export const options = {
  vus: 100,
  duration: '15s',
  thresholds: {
    failed_requests: ['rate<0.01'],
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(100)<2000'],
  },
};

export default function () {
  const res = http.get(`${url}/${generateRandomProductId()}`);
  check(res, {
    'status was 200': (r) => r.status === 200,
    'transaction time < 200ms': (r) => r.timings.duration < 200,
    'transaction time < 500ms': (r) => r.timings.duration < 500,
    'transaction time < 1000ms': (r) => r.timings.duration < 1000,
    'transaction time <2000ms': (r) => r.timings.duration < 2000,
  });
  failures.add(res.status !== 200);
  sleep(1);
}
