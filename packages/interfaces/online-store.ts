import { BaseResponse } from "./base"

export interface OnlineStore {
  id: number
  marketplace_id: string
  store_code: string
  store_name: string
  api_key: string
  client_id: string
  client_secret: string
  store_url: string
  is_active: boolean
  redirect_uri: string
  marketplace: {
    name: string
  }
}

export interface OnlineStoreResponse extends BaseResponse {
  data: OnlineStore[]
}