import { InputTypes } from "@/components/custom/dynamic-input"
import { Mode } from "react-day-picker"
import z from "zod/v3"

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
  id: string
  is_deleted: boolean
}

export interface BaseResponse {
  success: boolean
  message: string
}
export type BaseApiCallIndexProps = (page?: number, per_page?: number, search?: string) => Promise<Response>;

export type BaseApiCallCreateProps<T> = (values: T) => Promise<Response>;

export type BaseApiCallUpdateProps<T> = (id: string, values: T) => Promise<Response>;

export type BaseApiCallViewProps = (id: string) => Promise<Response>;

export type BaseApiCallRestoreProps = (id: string) => Promise<Response>;

export type BaseApiCallDeleteProps = (id: string) => Promise<Response>;

export interface BaseApiCallProps<T> {
  index?: BaseApiCallIndexProps
  master?: BaseApiCallIndexProps
  store?: BaseApiCallCreateProps<T>
  update?: BaseApiCallUpdateProps<T>
  show?: BaseApiCallViewProps
  restore?: BaseApiCallRestoreProps
  destroy?: BaseApiCallDeleteProps
}

interface BaseModal<T = string> {
  onSubmit?: () => void
  id?: T
  setId?: React.Dispatch<React.SetStateAction<T | undefined>>
}

interface Modal {
  onSubmit?: () => void
  index?: number
  setIndex?: React.Dispatch<React.SetStateAction<number | undefined>>
}

export interface BaseModalForm extends BaseModal {
  isEdit?: boolean
};

export interface BaseForm {
  id?: string
  disabled?: boolean
};

export interface BaseDialog<T = string> extends BaseModal<T> {
  title?: string
  description?: string
  action?: ((id: T) => Promise<Response> | void)
  variant?: "default" | "destructive"
};

export interface Dialog extends Modal {
  title?: string
  description?: string
  action?: ((id: number) => Promise<Response> | void)
  variant?: "default" | "destructive"
};

export interface FormShape<T> {
  key: keyof T & string;
  type: InputTypes;
  schema: z.ZodTypeAny;
  mode?: Mode;
  numberOfMonths?: number;
  label?: string;
  description?: string;
  placeholder?: string;
  max?: number;
  step?: number;
  options?: Record<string, string>;
  passwordEdit?: boolean;
  disabled?: boolean;
  source?: {
    id: string;
    label: string;
    api: BaseApiCallIndexProps | null;
  },
  defaultValue?: string | number | (string | number)[];
  custom?: | React.ReactElement | ((index: number) => React.ReactNode)
}