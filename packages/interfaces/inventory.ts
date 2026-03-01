import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface Inventory extends MasterData {
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
    detail: InventoryDetail[]
    total: number
}

export interface InventoryDetail {
    series: string
    quantity: number
}

export interface InventoryResponse extends IndexResponse {
    data: Inventory[]
}

export interface InventoryViewResponse extends BaseResponse {
    data: Inventory
}
