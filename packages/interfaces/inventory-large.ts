import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface LargeInventory extends MasterData {
    model_id: string
    color_id: string
    size_id: string
    model: {
        name: string
    }
    color: {
        name: string
    }
    size: {
        name: string
    }
    detail: LargeInventoryDetail[]
    total: number
}

export interface LargeInventoryDetail {
    series: string
    quantity: number
}

export interface LargeInventoryResponse extends IndexResponse {
    data: LargeInventory[]
}

export interface LargeInventoryViewResponse extends BaseResponse {
    data: LargeInventory
}
