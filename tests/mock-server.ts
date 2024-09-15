import { http, HttpResponse} from 'msw'
import { setupServer } from 'msw/node'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import type { Product } from '../types/models'

const parser = new XMLParser()
const builder = new XMLBuilder({ ignoreAttributes: true })

const apiError = (code: number, text: string): HttpResponse => {
    return HttpResponse.xml(builder.build({ Response: { ErrorCode: code, ErrorText: text }}))
  }
  
const server = setupServer(
    http.post('https://unittest/XMLService.ASP', async ({ request, params, cookies }) => {
      const data = await request.text()
      const req = parser.parse(data)
      if (req.ShippingOptions) {
        const so = req.ShippingOptions
        const p: Product[] = [].concat(so.Product)
        if (!so.Country) return apiError(2, "Country element is missing")
        if (!so.State_Province) return apiError(4, "State_Province element is missing")
        if (!so.PostalCode) return apiError(6, "PostalCode element is missing")
        if (!p || p.length === 0 || !p[0].ProductId) return apiError(8, "ProductId element is missing")
        if (!p[0].Quantity) return apiError(10, "Quantity element is missing")
  
        const xml = builder.build({
          Response: {
            ErrorCode: 0,
            ErrorText: "success",
            Option: [
              { Description: "USPS First Class", DeliveryTime: "2-5 days", Price: "1.29" },
              { Description: "UPS Ground", DeliveryTime: "2-4 days", Price: "7.90" },
              { Description: "Fedex 3-day", DeliveryTime: "3 days", Price: "8.24" },
            ]
          }
        })
        return HttpResponse.xml(xml)
      }
  
      if (req.Order) {
        const o = req.Order
        const p: Product[] = [].concat(o.Product)
        if (!o.Country) return apiError(2, "Country element is missing")
        if (!o.State_Province) return apiError(4, "State_Province element is missing")
        if (!o.PostalCode) return apiError(6, "PostalCode element is missing")
        if (!p || p.length === 0 || !p[0].ProductId) return apiError(8, "ProductId element is missing")
        if (!p[0].Quantity) return apiError(10, "Quantity element is missing")
        if (!o.UserId || !o.Password) return apiError(12, "UserId and/or password is not valid")
  
        const xml = builder.build({
          Response: {
            ErrorCode: 0,
            ErrorText: "success",
            OrderId: "567129"
          }
        })
        return HttpResponse.xml(xml)
      }
  
      if (req.OrderStatus) {
        const os = req.OrderStatus
        if (!os.UserId || !os.Password) return apiError(12, "UserId and/or password is not valid")
        if (!os.OrderId) return apiError(20, "OrderId element is missing")
        const xml = builder.build({
          Response: {
            ErrorCode: 0,
            ErrorText: "success",
            OrderId: "567129",
            OrderStatus: "processing",
            TrackingType: "Fedex",
            TrackingId: "XIU897Z9876"
          }
        })
        return HttpResponse.xml(xml)
      }
      return HttpResponse.error()
    })
  )
export default server
