import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface ProductModel extends MasterData {
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
