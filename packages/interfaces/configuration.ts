import { BaseResponse, IndexResponse, MasterData } from "./base";

export interface ConfigurationHistory {
  id: string;
  old_value: string;
  new_value: string;
  changed_by?: { name: string };
  changed_at: string;
}

export interface Configuration extends MasterData {
  config_key: string;
  config_value?: string;
  data_type: string;
  description?: string;
  updated_by?: { name: string };
  histories?: ConfigurationHistory[];
}

export interface ConfigurationResponse extends IndexResponse {
  data: Configuration[];
}

export interface ConfigurationViewResponse extends BaseResponse {
  data: Configuration;
}
