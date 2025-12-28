import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface Factory extends MasterData {
  code: string
  name: string
}

export interface FactoryResponse extends IndexResponse {
  data: Factory[]
}

export interface FactoryViewResponse extends BaseResponse {
  data: Factory
}
