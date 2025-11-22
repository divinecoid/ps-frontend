import { BaseResponse, IndexResponse } from "./base"

export interface Factory {
  id: number
  code: string
  name: string
}

export interface FactoryResponse extends IndexResponse {
  data: Factory[]
}

export interface FactoryViewResponse extends BaseResponse {
  data: Factory
}
