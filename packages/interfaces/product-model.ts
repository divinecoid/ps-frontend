import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface ProductModel extends MasterData {
  sku: string
  name: string
}

export interface ProductModelResponse extends IndexResponse {
  data: ProductModel[]
}

export interface ProductModelViewResponse extends BaseResponse {
  data: ProductModel
}
