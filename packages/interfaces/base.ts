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
export type BaseApiCallIndexProps = (page?: number, per_page?: number, search?: string) => Promise<Response>;

export type BaseApiCallCreateProps = (value: any) => Promise<Response>;
export type BaseApiCallUpdateProps = (id: string, value: any) => Promise<Response>;

export type BaseForm = { onSubmit: () => void, id?: string };
