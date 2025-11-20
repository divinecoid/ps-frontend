import { BaseResponse } from "./base"

export interface Product {
  id: number
  sku: string
  color_id: number
  model_id: number
  size_id: number
}

export interface ProductResponse extends BaseResponse {
  data: Product[]
}