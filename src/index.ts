import { OrderStatusQuery, OrderStatusResponse, OrderSubmission, OrderSubmissionResponse, ShippingOptionsQuery } from '../types/api'
import { ShippingOption } from '../types/models'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'

const parser = new XMLParser()
const builder = new XMLBuilder({ ignoreAttributes: true })


export const sendRequest = async (req: any) => {
  const body = builder.build(req)
  const response = await fetch('https://unittest/XMLService.ASP', {
    method: 'POST',
    headers: {
      Accept: 'application/xml',
      'Content-Type': 'application/xml',
    },
    body,
  })
  const xml = await response.text()

  let doc
  try {
    doc = parser.parse(xml)
  } catch (e) {
    throw new Error('xml parsing error')
  }
  if (doc.ErrorCode) {
    const errorText = doc.ErrorText
    throw new Error(errorText)
  }

  return doc.Response
}

export const shippingOptions = async ({
  Destination,
  Products
}: ShippingOptionsQuery): Promise<ShippingOption[]> => {
  const req = {
    ShippingOptions: {
      ...Destination,
      Product: Products
    }
  }
  const response = await sendRequest(req)
  return response.Option
}

export const placeOrder = async ({
  Auth,
  Order,
  Mode = 'TEST'
}: OrderSubmission): Promise<OrderSubmissionResponse> => {
  const req = {Order: {
    ...Auth,
    ...Order,
    Mode
  }}
  const response = await sendRequest(req)
  return response
}

export const getOrderStatus = async ({
  Auth,
  OrderId
}: OrderStatusQuery): Promise<OrderStatusResponse> => {
  const req = {OrderStatus: {
    ...Auth,
    OrderId
  }}
  const response = await sendRequest(req)
  return response
}

const Kunaki = {
  shippingOptions,
  placeOrder,
  getOrderStatus
}

export default Kunaki
