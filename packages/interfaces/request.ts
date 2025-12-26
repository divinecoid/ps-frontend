import { BaseResponse, IndexResponse } from "./base"
import { CMT } from "./cmt"

export type RequestStatus = "OPEN" | "CLOSED"

export interface Request {
  id: number
  cmt_id: number
  cmt: CMT
  status: RequestStatus
  created_date: Date
  request_detail: RequestDetail[]
}

export interface RequestDetail {
    id: number
    request_id: number
    product_id: number
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