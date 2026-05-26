import { BaseResponse, IndexResponse, MasterData } from "./base"
import { Product } from "./product"

export interface Products {
    series: string
    count: number
    items: Product[]
}

export interface SmallInventory extends MasterData {
    code: string
    name: string
    warehouse_id: string
    warehouse: {
        name: string
    }
    products: Products[]
}

export interface SmallInventoryResponse extends IndexResponse {
    data: SmallInventory[]
}

export interface SmallInventoryViewResponse extends BaseResponse {
    data: SmallInventory
}
