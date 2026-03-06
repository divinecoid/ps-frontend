import { BaseResponse, IndexResponse, MasterData } from "./base"

export interface Configuration extends MasterData {
    config_key: string
    config_value: string
    data_type: "boolean" | "integer" | "decimal" | "string"
    description: string
    created_by: { id: string; name: string } | null
    updated_by: { id: string; name: string } | null
}

export interface ConfigurationHistory {
    id: string
    old_value: string
    new_value: string
    changed_by: { id: string; name: string } | null
    changed_at: string
}

export interface ConfigurationDetail extends Configuration {
    histories: ConfigurationHistory[]
}

export interface ConfigurationResponse extends IndexResponse {
    data: Configuration[]
}

export interface ConfigurationViewResponse extends BaseResponse {
    data: ConfigurationDetail
}
