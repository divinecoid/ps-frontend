import { BaseResponse, IndexResponse } from "./base";
import { Color } from "./color";
import { Factory } from "./factory";

export type FabricPurchaseStatus = "OPEN" | "CLOSED";

export interface FabricPurchaseRequestDetail {
  id: string;
  fabric_purchase_request_id: string;
  color_id: string;
  color: Color;
  quantity: number;
  sequence: string | null;
}

export interface FabricPurchaseRequest {
  id: string;
  factory_id: string;
  factory: Factory;
  gram: string;
  ukuran: number;
  status: FabricPurchaseStatus;
  created_at: Date;
  details: FabricPurchaseRequestDetail[];
}

export interface FabricPurchaseRequestResponse extends IndexResponse {
  data: FabricPurchaseRequest[];
}

export interface FabricPurchaseRequestViewResponse extends BaseResponse {
  data: FabricPurchaseRequest;
}

export interface FabricPurchaseCreateDetail {
  color_id: string;
  quantity: number;
}

export interface FabricPurchaseCreate {
  factory_id: string;
  gram: string;
  roll_size_id: string;
  ukuran: number;
  details: FabricPurchaseCreateDetail[];
}
