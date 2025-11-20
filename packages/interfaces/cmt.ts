import { BaseResponse } from "./base"

export interface CMT {
  id: number
  code: string
  name: string
}

export interface CMTResponse extends BaseResponse {
  data: CMT[]
}