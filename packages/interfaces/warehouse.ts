import { BaseResponse } from "./base"

export interface Warehouse {
  id: number
  code: string
  name: string
  priority: number
}

export interface WarehouseResponse extends BaseResponse {
  data: Warehouse[]
}