import { BaseResponse, IndexResponse, MasterData } from "./base";

export interface Configuration extends MasterData {
  config_key: string;
}

export interface ConfigurationResponse extends IndexResponse {
  data: Configuration[];
}

export interface ConfigurationViewResponse extends BaseResponse {
  data: Configuration;
}
