import { BaseResponse } from "./base"

export interface Factory {
  id: number
  code: string
  name: string
}

export interface FactoryResponse extends BaseResponse {
  data: Factory[]
}