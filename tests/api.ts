import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { http, HttpResponse} from 'msw'
import { setupServer } from 'msw/node'
import Kunaki from '../src/index'
import type { Product, ShippingDestination } from '../types/models'

const API = suite('Kunaki API')

const server = setupServer(
  http.get('/XMLService.ASP', ({ request, params, cookies }) => {
    return HttpResponse.json(
      { message: 'Mocked response'},
      { status: 202, statusText: 'Mocked status'}
    )
  })
)

API.before(() => server.listen())
API.after(() => server.close())
API.after.each(() => server.resetHandlers())

API('foo', async () => {
  const products: Product[] = [
    { id: 'fred', quantity: 1 },
  ]
  const destination: ShippingDestination = {
    // city: 'foo',
    stateOrProvince: 'bar',
    postalCode: '44444',
    country: 'United States'
  }
  const opts = await Kunaki.shippingOptions({ destination, products})
  console.log('opts', opts)
  assert.is(opts.length, 1)
})
