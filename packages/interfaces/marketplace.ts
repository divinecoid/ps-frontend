import { BaseResponse } from "./base"

export interface Marketplace {
  id: number
  code: string
  name: string
  base_api_url: string
  description: string
  is_need_checker: string
}

export interface MarketplaceResponse extends BaseResponse {
  data: Marketplace[]
}