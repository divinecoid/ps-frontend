import { CMT } from "./cmt"
import { Color } from "./color"
import { ProductModel } from "./product-model"
import { Size } from "./size"

interface BarcodesPiece {
    barcode: string
    rack_id: string
}

export interface Inbound {
    barcodes_dozen: string[]
    warehouse_id: string
    barcodes_piece: BarcodesPiece[]
    notes: string
}

export interface InboundValidate {
    barcode: string
}

export interface InboundValidateResponse {
    success: boolean
    message: string
    data: {
        cmt: CMT
        model: ProductModel
        color: Color
        size: Size
        is_dozen: boolean
    }
}