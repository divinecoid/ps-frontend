import { BaseResponse } from "./base"

export interface Inventory {
  id: number
  serial_number: string
  product_id: number
  factory_id: number
  quantity: number
  cmt_id: number
  rack_id: number
  barcode_group: string
}

export interface InventoryResponse extends BaseResponse {
  data: Inventory[]
}