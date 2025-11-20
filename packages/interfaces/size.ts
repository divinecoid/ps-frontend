import { BaseResponse } from "./base"

export interface Size {
  id: number
  code: string
  name: string
}

export interface SizeResponse extends BaseResponse {
  data: Size[]
}