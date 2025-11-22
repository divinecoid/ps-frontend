import { BaseResponse, IndexResponse } from "./base"

export interface Color {
  id: number
  code: string
  name: string
}

export interface ColorResponse extends IndexResponse {
  data: Color[]
}

export interface ColorViewResponse extends BaseResponse {
  data: Color
}
