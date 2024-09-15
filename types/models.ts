export interface Product {
  ProductId: string
  Quantity: number
}

export interface ShippingDestination {
  Country: string
  State_Province: string
  PostalCode: string
}

export interface Order extends ShippingDestination {
  Name: string
  Company: string
  Address1: string
  Address2: string
  City: string
  Product: Product[]
  ShippingDescription: string
}

export interface ShippingOption {
  Description: string
  DeliveryTime: string
  Price: string
}
