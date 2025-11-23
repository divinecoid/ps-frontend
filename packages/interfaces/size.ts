import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface Size extends MasterData {
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
