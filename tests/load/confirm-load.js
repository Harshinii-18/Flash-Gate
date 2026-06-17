import http from 'k6/http'
  import exec from 'k6/execution'
import { check } from 'k6'
import { Counter } from 'k6/metrics'

export const options = {
  vus: 100,
  iterations: 100
}

const TOKEN = __ENV.TOKEN
const BASE_URL = 'http://localhost:4000'

const status202 =
  new Counter('status_202')

const reservationIds =
  JSON.parse(
    open('./reservation-ids.json')
  )

export default function() {

const reservationId =
  reservationIds[
    exec.scenario.iterationInTest
  ]

  const response = http.post(
    `${BASE_URL}/api/v1/orders/flash/confirm/${reservationId}`,
    null,
    {
      headers: {
        Authorization:
          `Bearer ${TOKEN}`,

        'Idempotency-Key':
          `confirm-${Date.now()}-${__VU}-${__ITER}`
      }
    }
  )

  if(response.status === 202) {
    status202.add(1)
  }
  // if (response.status !== 202) {
  //   console.log(
  //     response.status,
  //     response.body
  //   )
  // }
  check(response, {
    'accepted': r =>
      r.status === 202
  })
}