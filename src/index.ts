import {
  OrderStatusQuery,
  OrderStatusResponse,
  OrderSubmission,
  OrderSubmissionResponse,
  ShippingOptionsQuery,
} from '../types/api'
import { ShippingOption } from '../types/models'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'

const parser = new XMLParser()
const builder = new XMLBuilder({ ignoreAttributes: true })

const KunakiHost = process.env.KUNAKI_HOST || 'unittest'

export const sendRequest = async (req: object) => {
  const body = builder.build(req)
  const response = await fetch(`https://${KunakiHost}/XMLService.ASP`, {
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
    throw new Error(`xml parsing error: ${e}`)
  }
  if (doc.ErrorCode) {
    const errorText = doc.ErrorText
    throw new Error(errorText)
  }

  return doc.Response
}

export const shippingOptions = async ({
  Destination,
  Products,
}: ShippingOptionsQuery): Promise<ShippingOption[]> => {
  const req = {
    ShippingOptions: {
      ...Destination,
      Product: Products,
    },
  }
  const response = await sendRequest(req)
  return response.Option
}

export const placeOrder = async ({
  Auth,
  Order,
  Mode = 'TEST',
}: OrderSubmission): Promise<OrderSubmissionResponse> => {
  const req = {
    Order: {
      ...Auth,
      ...Order,
      Mode,
    },
  }
  const response = await sendRequest(req)
  return response
}

export const getOrderStatus = async ({
  Auth,
  OrderId,
}: OrderStatusQuery): Promise<OrderStatusResponse> => {
  const req = {
    OrderStatus: {
      ...Auth,
      OrderId,
    },
  }
  const response = await sendRequest(req)
  return response
}

const countriesList = [
  'Australia',
  'Austria',
  'Belgium',
  'Bulgaria',
  'Canada',
  'China',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Gibraltar',
  'Greenland',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'Ireland',
  'Italy',
  'Japan',
  'Latvia',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Mexico',
  'Netherlands',
  'New Zealand',
  'Norway',
  'Poland',
  'Portugal',
  'Romania',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
  'Switzerland',
  'Taiwan',
  'Turkey',
  'Ukraine',
  'United Kingdom',
  'United States',
  'Vatican City',
  'Yugoslavia',
]

const countrySelectOptions = countriesList.map((c) => ({ label: c, value: c }))

const Kunaki = {
  countriesList,
  countrySelectOptions,
  shippingOptions,
  placeOrder,
  getOrderStatus,
}

export default Kunaki
