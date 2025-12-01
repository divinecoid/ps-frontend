import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface Role extends MasterData {
  id: number
  name: string
  description: string
}

export interface RoleResponse extends IndexResponse {
  data: Role[]
}

export interface RoleViewResponse extends BaseResponse {
  data: Role
}
