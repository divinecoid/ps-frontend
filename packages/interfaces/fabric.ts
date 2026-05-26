import { BaseResponse, IndexResponse, MasterData } from "./base"
import { Color } from "./color"
import { Factory } from "./factory"
import { RollSize } from "./roll-size"

export interface Fabric extends MasterData {
  factory_id: string
  factory: Factory
  gram: string
  roll_size_id: string
  roll_size: RollSize
  color_id: string
  color: Color
  quantity: number
  sequence: string

}

export interface FabricResponse extends IndexResponse {
  data: Fabric[]
}

export interface FabricViewResponse extends BaseResponse {
  data: Fabric
}
