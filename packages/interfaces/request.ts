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
  dozen_qty: number
  piece_qty: number
}

export interface Request {
  id: string
  cmt_id: string
  cmt: CMT
  status: RequestStatus
  created_date: Date
  request_detail: RequestDetail[]
  receive_log: ReceiveLog[]
}

export interface RequestDetail {
  id: string
  request_id: string
  product_id: string
  dozen_qty: number
  piece_qty: number
  bs_qty: number
  code: string
}

export interface RequestResponse extends IndexResponse {
  data: Request[]
}

export interface RequestViewResponse extends BaseResponse {
  data: Request
}