import { BaseResponse } from "./base"
import { CMT } from "./cmt"
import { Color } from "./color"
import { ProductModel } from "./product-model"
import { Rack } from "./rack"
import { Size } from "./size"

interface Items {
    rack_id: string
    rack?: Rack
    barcodes: string[]
}

export interface Mutation {
    id?: string
    items: Items[]
    mutation_date?: Date
}

export interface MutationValidate {
    barcode: string
}

export interface MutationValidateResponse extends BaseResponse {
    data: {
        cmt: CMT
        model: ProductModel
        color: Color
        size: Size
    }
}

// export interface MutationResponse extends BaseResponse {
//     data: {
//         id: string
//         user: {
//             name: string
//         }
//         received_date: Date
//         request: {
//             cmt: CMT
//         }
//     }
// }