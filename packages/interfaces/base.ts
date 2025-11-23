export interface Pagination {
  current_page: number
  per_page: number
  last_page: number
  total: number
}

export interface IndexResponse extends BaseResponse {
  pagination: Pagination
}

export interface MasterData {
  is_deleted: boolean
}

export interface BaseResponse {
  success: boolean
  message: string
}
export type BaseApiCallIndexProps = (page?: number, per_page?: number, search?: string) => Promise<Response>;

type BaseApiCallCreateProps = (value: any) => Promise<Response>;

type BaseApiCallUpdateProps = (id: number, value: any) => Promise<Response>;

type BaseApiCallViewProps = (id: number) => Promise<Response>;

type BaseApiCallRestoreProps = (id: number) => Promise<Response>;

type BaseApiCallDeleteProps = (id: number) => Promise<Response>;

export interface BaseApiCallProps {
  index?: BaseApiCallIndexProps
  master?: BaseApiCallIndexProps
  store?: BaseApiCallCreateProps
  update?: BaseApiCallUpdateProps
  show?: BaseApiCallViewProps
  restore?: BaseApiCallRestoreProps
  destroy?: BaseApiCallDeleteProps
}

interface BaseModal {
  onSubmit: () => void
  id?: number
  setId?: React.Dispatch<React.SetStateAction<number>>
}

export interface BaseForm extends BaseModal {
  isEdit?: boolean
};

export interface BaseDialog extends BaseModal {
  title?: string
  description?: string
  action?: (id: number) => Promise<Response>;
};