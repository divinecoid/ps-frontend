export interface Pagination {
  current_page: number
  per_page: number
  last_page: number
  total: number
}

export interface BaseResponse {
  success: boolean
  message: string
  pagination: Pagination
}
export type BaseApiCallProps = (page?: number, per_page?: number, search?: string) => Promise<Response>;