import { BaseResponse } from "./base"

export interface Color {
  id: number
  code: string
  name: string
}

export interface ColorResponse extends BaseResponse {
  data: Color[]
}