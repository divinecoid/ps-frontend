import { BaseResponse, IndexResponse } from "./base"

export type CuttingStatus = "OPEN" | "CLOSED"

export interface FabricCuttingRequestDetail {
  id?: string
  request_id?: string
  product_id?: string
  req_qty: number
  rec_qty: number
  code?: string
  model_id?: string
  models?: { name: string; sku: string }
  model?: { name: string; sku: string }
  size?: { name: string; code: string }
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
  fabric?: { sequence: string }
  clothes?: { sequence: string }
  request_detail: FabricCuttingRequestDetail[]
  status?: CuttingStatus
  created_at: Date
}

export interface FabricCuttingResponse extends IndexResponse {
  data: FabricCutting[]
}

export interface FabricCuttingViewResponse extends BaseResponse {
  data: FabricCutting
}
