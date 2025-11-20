import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { Warehouse } from "@/interfaces/warehouse";

const URL = {
    WAREHOUSE: "warehouse"
}

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(URL.WAREHOUSE, {page, per_page, search});
}

export const store = async (values: Warehouse) => {
    return await POST(URL.WAREHOUSE, values);
}

export const update = async (id: string, values: Warehouse) => {
    return await PATCH(`${URL.WAREHOUSE}/${id}`, values);
}