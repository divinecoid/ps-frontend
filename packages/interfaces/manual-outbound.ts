import { BaseResponse } from "./base"

export interface ManualOutboundValidateBarcode {
    barcode: string
}

export interface ManualOutboundValidateBarcodeResponse extends BaseResponse {
    data: {
        product: {
            id: string
            barcode: string
            model: {
                id: string
                name: string
                sku: string
            } | null
            color: {
                id: string
                name: string
                code: string
            } | null
            size: {
                id: string
                name: string
                code: string
            } | null
            rack: {
                id: string
                code: string
                name: string
            } | null
        }
    }
}

export interface ManualOutboundSubmit {
    marketplace_id?: string
    barcodes: string[]
    notes?: string
}

export interface ManualOutboundSubmitResponse extends BaseResponse {
    data: {
        total_items: number
    }
}
