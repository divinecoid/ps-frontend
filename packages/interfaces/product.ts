import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface Product extends MasterData {
  model_id: string
  rack_id: string
  model: {
    name: string
  }
  rack: {
    name: string
  }
  barcode: string
}

export interface ProductResponse extends IndexResponse {
  data: Product[]
}

export interface ProductViewResponse extends BaseResponse {
  data: Product
}
