import { BaseResponse, IndexResponse } from "./base"

export interface CMT {
  id: number
  code: string
  name: string
}

export interface CMTResponse extends IndexResponse {
  data: CMT[]
}

export interface CMTViewResponse extends BaseResponse {
  data: CMT
}
