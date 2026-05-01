import { BaseResponse, IndexResponse, MasterData } from "./base"
import { Product } from "./product"

export interface SmallInventory extends MasterData {
    code: string
    name: string
    warehouse_id: string
    warehouse: {
        name: string
    }
    products: Product[]
}

export interface SmallInventoryResponse extends IndexResponse {
    data: SmallInventory[]
}

export interface SmallInventoryViewResponse extends BaseResponse {
    data: SmallInventory
}
