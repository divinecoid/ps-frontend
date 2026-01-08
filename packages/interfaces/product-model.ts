import { BaseResponse, IndexResponse, MasterData } from "./base"
import { Color } from "./color"
import { Size } from "./size"

export interface ProductModel extends MasterData {
  sku: string
  name: string
  color_id: string[]
  size_id: string[]
  colors: Color[]
  sizes: Size[]
}

export interface ProductModelResponse extends IndexResponse {
  data: ProductModel[]
}

export interface ProductModelViewResponse extends BaseResponse {
  data: ProductModel
}
