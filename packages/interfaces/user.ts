import { BaseResponse, IndexResponse, MasterData } from "./base"
import { Role } from "./role"

export interface User extends MasterData {
  name: string
  username: string
  email: string
  password?: string
  roles: Role[]
  role_id: string[]
}

export interface UserResponse extends IndexResponse {
  data: User[]
}

export interface UserViewResponse extends BaseResponse {
  data: User
}
