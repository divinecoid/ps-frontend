import { BaseResponse, IndexResponse } from "./base"
import { CMT } from "./cmt"

export type RequestStatus = "OPEN" | "CLOSED"

export interface Request {
  id: string
  cmt_id: string
  cmt: CMT
  status: RequestStatus
  created_date: Date
  request_detail: RequestDetail[]
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