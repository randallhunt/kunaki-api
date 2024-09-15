import { Order, Product, ShippingDestination } from "./models"

export interface Auth {
  UserId: string
  Password: string
}

export interface ShippingOptionsQuery {
  Destination: ShippingDestination
  Products: Product[]  
}

export interface OrderStatusQuery {
  Auth: Auth
  OrderId: string
}

export interface OrderStatusResponse {
  OrderId: string
  OrderStatus: string
  TrackingType: string
  TrackingId: string
}

export interface OrderSubmission {
  Auth: Auth
  Order: Order
  Mode: "TEST" | "LIVE"
}

export interface OrderSubmissionResponse {
  OrderId: string
}
