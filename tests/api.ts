import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import server from './mock-server'
import Kunaki from '../src/index'
import type { Auth } from '../types/api'
import type { Order, Product, ShippingDestination } from '../types/models'

const API = suite('Kunaki API')

API.before(() => server.listen())
API.after(() => server.close())
API.after.each(() => server.resetHandlers())

API('get shipping options', async () => {
  const Products: Product[] = [
    { ProductId: 'fred', Quantity: 1 },
  ]
  const Destination: ShippingDestination = {
    State_Province: 'bar',
    PostalCode: '44444',
    Country: 'United States'
  }
  const res = await Kunaki.shippingOptions({ Destination, Products})
  assert.type(res, 'object')
  assert.is(res.length, 3)
})

API('place order', async () => {
  const Auth: Auth = { UserId: "fred", Password: "foo" }
  const Order: Order = {
    Name: "Fred Flintstone",
    Company: "Spacely Sprockets",
    Address1: "123 Rock St",
    Address2: "",
    City: "Bedrock",
    State_Province: 'bar',
    PostalCode: '44444',
    Country: 'United States',
    Product: [{ ProductId: "123456", Quantity: 1 }],
    ShippingDescription: "Fedex"
  }
  const res = await Kunaki.placeOrder({ Auth, Order, Mode: "TEST"})
  assert.is(res.OrderId, 567129)
})

API('check order status', async () => {
  const sts = await Kunaki.getOrderStatus({ Auth: { UserId: "fred", Password: "barney" }, OrderId: "12345" })
  assert.is(sts.TrackingId, "XIU897Z9876")
})

API.run()
