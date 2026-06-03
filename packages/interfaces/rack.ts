import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface Rack extends MasterData {
  code: string
  name: string
  warehouse_id: string
  warehouse?: {
    name: string
  }
  model_id?: string | null
  model?: {
    name: string
  } | null
  color_id?: string | null
  color?: {
    name: string
  } | null
}

export interface RackResponse extends IndexResponse {
  data: Rack[]
}

export interface RackViewResponse extends BaseResponse {
  data: Rack
}