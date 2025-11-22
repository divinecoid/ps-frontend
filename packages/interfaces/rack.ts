import { BaseResponse, IndexResponse } from "./base"

export interface Rack {
  id: number
  code: string
  name: string
  warehouse_id: number
  warehouse: {
    name: string
  }
}

export interface RackResponse extends IndexResponse {
  data: Rack[]
}

export interface RackViewResponse extends BaseResponse {
  data: Rack
}