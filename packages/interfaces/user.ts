import { BaseResponse, IndexResponse, MasterData } from "./base"
import { Role } from "./role"

export interface User extends MasterData {
  id: number
  name: string
  username: string
  email: string
  roles: Role[]
}

export interface UserResponse extends IndexResponse {
  data: User[]
}

export interface UserViewResponse extends BaseResponse {
  data: User
}
