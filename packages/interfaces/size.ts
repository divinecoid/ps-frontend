import { BaseResponse, IndexResponse } from "./base"

export interface Size {
  id: number
  code: string
  name: string
}

export interface SizeResponse extends IndexResponse {
  data: Size[]
}

export interface SizeViewResponse extends BaseResponse {
  data: Size
}
