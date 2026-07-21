import { MasterData } from "./base";

export interface ReturnReceiptDetail {
  id: string;
  order_item_id: string;
  barcode_scanned: string | null;
  is_received: boolean;
  order_item: {
    item_name: string;
    color: string;
    size: string;
    quantity_purchased: number;
  } | null;
}

export interface ReturnReceipt extends MasterData {
  order_id: string;
  awb_code: string;
  received_at: string | null;
  return_status: "pending" | "partial" | "received";
  notes: string | null;
  user: {
    id: string;
    name: string;
  } | null;
  order: {
    id: string;
    order_sn: string;
    customer_name: string;
    marketplace: {
      name: string;
    } | null;
  } | null;
  details: ReturnReceiptDetail[];
}
