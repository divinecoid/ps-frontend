import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface CMT extends MasterData {
  code: string
  name: string
}

export interface CMTResponse extends IndexResponse {
  data: CMT[]
}

export interface CMTViewResponse extends BaseResponse {
  data: CMT
}
