import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface RollSize extends MasterData {
    size: string
}

export interface RollSizeResponse extends IndexResponse {
    data: RollSize[]
}

export interface RollSizeViewResponse extends BaseResponse {
    data: RollSize
}
