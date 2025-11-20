import { BaseResponse } from "./base"

export interface Rack {
  id: number
  code: string
  name: string
  warehouse_id: number
  warehouse: {
    name: string
  }
}

export interface RackResponse extends BaseResponse {
  data: Rack[]
}