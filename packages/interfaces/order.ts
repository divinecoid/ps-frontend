import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface Order extends MasterData {
    awb_code: string;
    read_at: Date;
    prepared_at: Date;
    prepare_duration: number;
    readytoship_at: Date;
    readytoship_marketplace: string;
    online_store_id: string;
    item_count: number;
    unique_item_count: number;
    status: 'pending' | 'read' | 'prepared' | 'ready_to_ship' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    total_weight: number;
    total_price: number;
    total_shipping: number;
    total_amount: number;
    preparist_user_id: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    marketplace_id: string;
}

export interface OrderResponse extends IndexResponse {
    data: Order[]
}

export interface OrderViewResponse extends BaseResponse {
    data: Order
}