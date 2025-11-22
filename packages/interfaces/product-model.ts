import { BaseResponse, IndexResponse } from "./base"

export interface ProductModel {
  id: number
  code: string
  name: string
}

export interface ProductModelResponse extends IndexResponse {
  data: ProductModel[]
}

export interface ProductModelViewResponse extends BaseResponse {
  data: ProductModel
}
