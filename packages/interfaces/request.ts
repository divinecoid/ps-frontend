import { BaseResponse, IndexResponse } from "./base"
import { CMT } from "./cmt"

export type RequestStatus = "OPEN" | "CLOSED"

export interface ReceiveLog {
  id: string
  warehouse: {
    name: string
  }
  user: {
    name: string
  }
  received_date: Date
  notes: string
  created_at: Date
  cmt_id: string
  cmt: {
    name: string
  }
  details: ReceiveLogDetail[]
}

export interface ReceiveLogDetail {
  model_id: string
  model: {
    name: string
  }
  color_id: string
  color: {
    name: string
  }
  size_id: string
  size: {
    name: string
  }
  barcode: string
  qty: number
}

export interface PendingBarcode {
  barcode: string
  type: "Dozen" | "Piece"
  model: string
  color: string
  size: string
}

export interface Request {
  id: string
  serial_number: string
  cmt_id: string
  cmt: CMT
  status: RequestStatus
  created_at: Date
  request_detail: RequestDetail[]
  receive_log: ReceiveLog[]
  pending_barcodes?: PendingBarcode[]
}

export interface RequestDetail {
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

export interface RequestResponse extends IndexResponse {
  data: Request[]
}

export interface RequestViewResponse extends BaseResponse {
  data: Request
}