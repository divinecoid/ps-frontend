import { BaseResponse } from "./base"

export interface ProductModel {
  id: number
  code: string
  name: string
}

export interface ProductModelResponse extends BaseResponse {
  data: ProductModel[]
}