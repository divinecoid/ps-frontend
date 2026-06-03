import { BaseResponse, IndexResponse } from "./base"

export type CuttingStatus = "OPEN" | "CLOSED"

export interface FabricCuttingRequestDetail {
  id: string
  request_id: string
  product_id: string
  dozen_qty: number
  piece_qty: number
  bs_qty: number
  code: string
  variant_detail?: VariantDetail[]
}

interface VariantDetail {
  dozen_qty: number
  piece_qty: number
}

export interface FabricCutting {
  id: string
  fabric_id: string
  quantity: number
  serial_number: string
  request_detail: FabricCuttingRequestDetail[]
  status: CuttingStatus
  created_at: Date
}

export interface FabricCuttingResponse extends IndexResponse {
  data: FabricCutting[]
}

export interface FabricCuttingViewResponse extends BaseResponse {
  data: FabricCutting
}
