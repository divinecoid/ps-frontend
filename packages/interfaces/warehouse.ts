import { BaseResponse, IndexResponse } from "./base"

export interface Warehouse {
  id: number
  code: string
  name: string
  priority: number
}

export interface WarehouseResponse extends IndexResponse {
  data: Warehouse[]
}

export interface WarehouseViewResponse extends BaseResponse {
  data: Warehouse
}
