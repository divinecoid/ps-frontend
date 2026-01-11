import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface OnlineStore extends MasterData {
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
  access_token: string
  refresh_token: string
  access_token_expires_at: Date
  refresh_token_expires_at: Date
}

export interface OnlineStoreResponse extends IndexResponse {
  data: OnlineStore[]
}

export interface OnlineStoreViewResponse extends BaseResponse {
  data: OnlineStore
}
