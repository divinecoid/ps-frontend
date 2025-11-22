import { BaseResponse, IndexResponse } from "./base"

export interface Inventory {
  id: number
  serial_number: string
  product_id: number
  factory_id: number
  quantity: number
  cmt_id: number
  rack_id: number
  barcode_group: string
  product: {
    name: string
  }
  factory: {
    name: string
  }
  cmt: {
    name: string
  }
  rack: {
    name: string
  }
}

export interface InventoryResponse extends IndexResponse {
  data: Inventory[]
}

export interface InventoryViewResponse extends BaseResponse {
  data: Inventory
}
