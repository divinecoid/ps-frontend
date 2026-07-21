import { BaseResponse, IndexResponse, MasterData } from "./base";
import { Marketplace } from "./marketplace";
import { OnlineStore } from "./online-store";
import { User } from "./user";

export interface Order extends MasterData {
  order_sn: string;
  awb_code: string;
  read_at: Date;
  prepared_at: Date;
  prepare_duration: number;
  readytoship_at: Date;
  readytoship_marketplace: string;
  online_store_id: string;
  item_count: number;
  unique_item_count: number;
  status:
  | "pending"
  | "read"
  | "prepared"
  | "ready_to_ship"
  | "ready_to_pickup"
  | "retry_ship"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";
  total_weight: number;
  total_price: number;
  total_amount: number;
  total_shipping: number;
  preparist_user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  marketplace_id: string;
  marketplace: Marketplace;
}

export interface OrderItem {
  id: string;
  order_item_id: string;
  sku: string;
  item_name: string;
  color: string;
  size: string;
  price: number;
  discounted_price: number;
  quantity_purchased: number;
  item_index: number;
  total_quantity: number;
  product?: {
    id: string;
    name: string;
  };
}

export interface OrderItemsResponse extends BaseResponse {
  data: {
    order_id: string;
    total_items: number;
    unique_items: number;
    items: OrderItem[];
  };
}

export interface ViewOrderDetail {
  id: string
  //store detail
  online_store_id: string;
  online_store: OnlineStore;
  marketplace_id: string;
  marketplace: Marketplace;
  //order detail
  order_sn: string;
  awb_code: string;
  read_at: Date;
  prepared_at: Date;
  prepare_duration: number;
  readytoship_at: Date;
  readytoship_marketplace: string;
  status:
  | "pending"
  | "read"
  | "prepared"
  | "ready_to_ship"
  | "ready_to_pickup"
  | "retry_ship"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";
  //product details
  item_count: number;
  unique_item_count: number;
  total_weight: number;
  total_price: number;
  total_amount: number;
  total_shipping: number;
  //preparist
  preparist_user_id: string;
  preparist_user: User;
  //customer
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  //items
  items?: OrderItem[];
}

export interface OrderResponse extends IndexResponse {
  data: Order[];
}

export interface OrderViewResponse extends BaseResponse {
  data: ViewOrderDetail;
}

export interface TimeSlot {
  date: number;
  time_text: string;
  pickup_time_id: string;
  flags: string[];
  start_time?: number;
  end_time?: number;
  available?: boolean;
}

export interface AddressList {
  address_id: number;
  region: string;
  state: string;
  city: string;
  district: string;
  town: string;
  address: string;
  zipcode: string;
  address_flag: string[];
  time_slot_list: TimeSlot[];
}

export interface TiktokShipPackage {
  package_id: string;
  handover_method: "PICKUP" | "DROP_OFF";
  pickup_slot?: {
    start_time: number;
    end_time: number;
  };
  self_shipment?: {
    tracking_number: string;
    shipping_provider_id: string;
  };
}

export interface ShopeeOrderShippingParameter extends BaseResponse {
  data: {
    error: string;
    message: string;
    warning: string;
    request_id: string;
    response: {
      info_needed: {
        pickup: string[];
        dropoff: object;
      };
      pickup: {
        address_list: AddressList[];
      };
      dropoff: object;
    };
  };
}

export interface ShopeeShipOrder {
  order_sn: string;
  address_id?: string;
  pickup_time_id?: string;
  dropoff?: object
}

export interface ShopeeDocument {
  order_sn: string;
}
