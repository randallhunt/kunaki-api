export interface Product {
  id: string
  quantity: number
}

export interface ShippingDestination {
  country: string
  stateOrProvince: string
  postalCode: string
}

export interface Order extends ShippingDestination {
  name: string
  company: string
  address1: string
  address2: string
  city: string
  products: Product[]
  shippingDescription: string
}

export interface ShippingOption {
  description: string
  deliveryTime: string
  price: string
}
