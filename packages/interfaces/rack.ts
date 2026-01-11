import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface Rack extends MasterData {
  code: string
  name: string
  warehouse_id: string
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