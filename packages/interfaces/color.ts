import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface Color extends MasterData {
  code: string
  name: string
}

export interface ColorResponse extends IndexResponse {
  data: Color[]
}

export interface ColorViewResponse extends BaseResponse {
  data: Color
}
