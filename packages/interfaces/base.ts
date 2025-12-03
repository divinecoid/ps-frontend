import { InputTypes } from "@/components/custom/dynamic-input"
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
  is_deleted: boolean
}

export interface BaseResponse {
  success: boolean
  message: string
}
export type BaseApiCallIndexProps = (page?: number, per_page?: number, search?: string) => Promise<Response>;

type BaseApiCallCreateProps<T> = (values: T) => Promise<Response>;

type BaseApiCallUpdateProps<T> = (id: number, values: T) => Promise<Response>;

type BaseApiCallViewProps = (id: number) => Promise<Response>;

type BaseApiCallRestoreProps = (id: number) => Promise<Response>;

type BaseApiCallDeleteProps = (id: number) => Promise<Response>;

export interface BaseApiCallProps <T>{
  index?: BaseApiCallIndexProps
  master?: BaseApiCallIndexProps
  store?: BaseApiCallCreateProps<T>
  update?: BaseApiCallUpdateProps<T>
  show?: BaseApiCallViewProps
  restore?: BaseApiCallRestoreProps
  destroy?: BaseApiCallDeleteProps
}

interface BaseModal {
  onSubmit: () => void
  id?: number
  setId?: React.Dispatch<React.SetStateAction<number|undefined>>
}

export interface BaseModalForm extends BaseModal {
  key?: number
  isEdit?: boolean
};

export interface BaseForm {
  id?: number
};

export interface BaseDialog extends BaseModal {
  title?: string
  description?: string
  action?: (id: number) => Promise<Response>;
};

export interface FormShape<T> {
    key: keyof T & string;
    type: InputTypes;
    schema: z.ZodTypeAny;
    label?: string;
    description?: string;
    placeholder?: string;
    max?: number;
    step?: number;
    options?: Record<string, string>;
    passwordEdit?: boolean;
    source?: {
        id: string;
        label: string;
        api: BaseApiCallIndexProps | null;
    },
    defaultValue?: string | number | (string | number)[];
}