import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface ProductGroup extends MasterData {
  model_id: string
  model: {
    name: string
  }
  color: {
    name: string
  } | null
  size: {
    name: string
  } | null
  series: string
  qty: number
}

export interface ProductGroupResponse extends IndexResponse {
  data: ProductGroup[]
}

export interface ProductGroupViewResponse extends BaseResponse {
  data: ProductGroup
}
