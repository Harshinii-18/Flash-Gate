import http from 'k6/http'
import { check } from 'k6'
import { Counter } from 'k6/metrics'

const status201 = new Counter('status_201')
const status200 = new Counter('status_200')
const status400 = new Counter('status_400')
const status409 = new Counter('status_409')
const status500 = new Counter('status_500')

export const options = {
  vus: 100,
  iterations: 500,
  // duration: '10s',

  thresholds: {
    http_req_failed: ['rate<0.5'],
    http_req_duration: ['p(95)<1500']
  }
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000'
const PRODUCT_ID = __ENV.PRODUCT_ID
const TOKEN = __ENV.TOKEN

if (!PRODUCT_ID) {
  throw new Error('PRODUCT_ID environment variable missing')
}

if (!TOKEN) {
  throw new Error('TOKEN environment variable missing')
}

export default function () {

  const response = http.post(
    `${BASE_URL}/api/v1/flash/reserve`,
    JSON.stringify({
      productId: PRODUCT_ID,
      quantity: 1
    }),
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',

        // unique request every time
        'Idempotency-Key': `load-${__VU}-${__ITER}`
      }
    }
  )
  if (
  response.status !== 201 &&
  response.status !== 400
) {
  console.log(
    response.status,
    response.body
  )
}
  switch (response.status) {
    case 201:
      status201.add(1)
      break

    case 400:
      status400.add(1)
      break
      
    case 200:
      status200.add(1)
      break
    case 409:
      status409.add(1)
      break

    case 500:
      status500.add(1)
      break
  }

  check(response, {
    'status 201 or 400': (r) =>
      r.status === 201 || r.status === 400
  })
}