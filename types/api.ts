import { Order, Product, ShippingDestination } from "./models"

export interface Auth {
  userId: string
  password: string
}

export interface ShippingOptionsQuery {
  destination: ShippingDestination
  products: Product[]  
}

export interface OrderStatusQuery {
  auth: Auth
  orderId: string
}

export interface OrderStatusResponse {
  orderId: string
  orderStatus: string
  trackingType: string
  trackingId: string
}

export interface OrderSubmission {
  auth: Auth
  order: Order
  mode: "TEST" | "LIVE"
}

export interface OrderSubmissionResponse {
  orderId: string
}
