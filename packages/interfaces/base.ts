export interface Pagination {
  current_page: number
  per_page: number
  last_page: number
  total: number
}

export interface IndexResponse extends BaseResponse {
  pagination: Pagination
}

export interface BaseResponse {
  success: boolean
  message: string
}
export type BaseApiCallIndexProps = (page?: number, per_page?: number, search?: string) => Promise<Response>;

type BaseApiCallCreateProps = (value: any) => Promise<Response>;

type BaseApiCallUpdateProps = (id: number, value: any) => Promise<Response>;

type BaseApiCallViewProps = (id: number) => Promise<Response>;

export type BaseForm = {
  onSubmit: () => void,
  isEdit?: boolean
  id?: number
  setId?: React.Dispatch<React.SetStateAction<number>>
};

export interface BaseApiCallProps {
  index: BaseApiCallIndexProps
  store: BaseApiCallCreateProps
  update: BaseApiCallUpdateProps
  show: BaseApiCallViewProps
}
