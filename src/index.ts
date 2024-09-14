import { OrderStatusQuery, OrderStatusResponse, OrderSubmission, OrderSubmissionResponse, ShippingOptionsQuery } from '../types/api'
import { ShippingOption } from '../types/models'
import pjxml from './pjxml'

export const sendRequest = async (body: string) => {
  console.log(body)
  const response = await fetch('https://unittest/XMLService.ASP', {
    method: 'POST',
    headers: {
      Accept: 'application/xml',
      'Content-Type': 'application/xml',
    },
    body,
  })
  const xml = await response.text()
  console.log(xml)

  let doc
  try {
    doc = pjxml.parse(xml)
  } catch (e) {
    // console.log(`error`, e);
    throw new Error('xml parsing error')
  }

  const errorCode = doc.select('//ErrorCode').text()
  if (errorCode != 0) {
    const errorText = doc.select('//ErrorText').text()
    // console.log(errorText);
    throw new Error(errorText)
  }
  return doc
}

export const shippingOptions = async ({ destination, products }: ShippingOptionsQuery): Promise<ShippingOption[]> => {
  const productsXml = products.map(
    (p) =>
      `<Product><ProductId>${p.id}</ProductId><Quantity>${p.quantity}</Quantity></Product>`
  )

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <ShippingOptions>
    <Country>${destination.country}</Country>
    <State_Province>${destination.stateOrProvince}</State_Province>
    <PostalCode>${destination.postalCode}</PostalCode>
    ${productsXml}
  </ShippingOptions>
  `
  const response = await sendRequest(body)

  const options = response.selectAll('//Option')
  return options.map((opt: any) => {
    const description = opt.select('//Description').text()
    const deliveryTime = opt.select('//DeliveryTime').text()
    const price = opt.select('//Price').text()
    return { description, deliveryTime, price }
  })
}

export const placeOrder = async ({ auth, order, mode = 'TEST' }: OrderSubmission): Promise<OrderSubmissionResponse> => {
  const productsXml = order.products.map(
    (p) =>
      `<Product><ProductId>${p.id}</ProductId><Quantity>${p.quantity}</Quantity></Product>`
  )

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <Order>
    <UserId>${auth.userId}</UserId>
    <Password>${auth.password}</Password>
    <Mode>${mode}</Mode>
    <Name>${order.name}</Name>
    <Company>${order.company}</Company>
    <Address1>${order.address1}</Address1>
    <Address2>${order.address2}</Address2>
    <City>${order.city}</City>
    <State_Province>${order.stateOrProvince}</State_Province>
    <PostalCode>${order.postalCode}</PostalCode>
    <Country>${order.country}</Country>
    <ShippingDescription>${order.shippingDescription}</ShippingDescription>
    ${productsXml}
  </Order>
  `
  const doc = await sendRequest(body)
  return { orderId: doc.select('//OrderId').text() }
}

export const getOrderStatus = async ({ auth, orderId }: OrderStatusQuery): Promise<OrderStatusResponse> => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <OrderStatus>
    <UserId>${auth.userId}</UserId>
    <Password>${auth.password}</Password>
    <OrderId>${orderId}</OrderId>
  </OrderStatus>
  `
  const doc = await sendRequest(body)

  const orderStatus = doc.select('//OrderStatus').text()
  const trackingType = doc.select('//TrackingType').text()
  const trackingId = doc.select('//TrackingId').text()
  return {
    orderId,
    orderStatus,
    trackingType,
    trackingId,
  }
}

const Kunaki = {
  shippingOptions,
  placeOrder,
  getOrderStatus
}

export default Kunaki
