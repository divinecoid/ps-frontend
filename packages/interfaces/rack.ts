import { BaseResponse } from "./base"

export interface Rack {
  id: number
  code: string
  name: string
  warehouse_id: number
}

export interface RackResponse extends BaseResponse {
  data: Rack[]
}