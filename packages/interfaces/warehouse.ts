import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface Warehouse extends MasterData {
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
