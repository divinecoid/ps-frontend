import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface Marketplace extends MasterData {
  code: string
  name: string
  alias: string
  base_api_url: string
  description: string
  is_need_checker: string
}

export interface MarketplaceResponse extends IndexResponse {
  data: Marketplace[]
}

export interface MarketplaceViewResponse extends BaseResponse {
  data: Marketplace
}
