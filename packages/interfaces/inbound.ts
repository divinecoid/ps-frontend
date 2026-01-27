import { BaseResponse } from "./base"
import { CMT } from "./cmt"
import { Color } from "./color"
import { ProductModel } from "./product-model"
import { Size } from "./size"
import { Warehouse } from "./warehouse"

interface BarcodesPiece {
    barcode: string
    rack_id: string
}

export interface Inbound {
    id?: string
    barcodes_dozen?: string[]
    warehouse_id?: string
    warehouse?: Warehouse
    barcodes_piece?: BarcodesPiece[]
    received_date?: Date
    notes: string
}

export interface InboundValidate {
    barcode: string
}

export interface InboundValidateResponse extends BaseResponse {
    data: {
        cmt: CMT
        model: ProductModel
        color: Color
        size: Size
        is_dozen: boolean
    }
}

export interface InboundResponse extends BaseResponse {
    data: {
        id: string
        warehouse_id: string
        warehouse: {
            name: string
        }
        user: {
            name: string
        }
        received_date: Date
        request: {
            cmt: CMT
        }
    }
}