import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface Product extends MasterData {
  sku: string
  color_id: string
  model_id: string
  size_id: string
  color: {
    name: string
  }
  model: {
    name: string
  }
  size: {
    name: string
  }
}

export interface ProductResponse extends IndexResponse {
  data: Product[]
}

export interface ProductViewResponse extends BaseResponse {
  data: Product
}
