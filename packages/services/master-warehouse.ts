import { BaseApiCallIndexProps } from "@/interfaces/base";
import { GET, PATCH, POST } from "./api"
import { Warehouse } from "@/interfaces/warehouse";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.WAREHOUSE, {page, per_page, search});
}

export const store = async (values: Warehouse) => {
    return await POST(ENDPOINT.WAREHOUSE, values);
}

export const update = async (id: number, values: Warehouse) => {
    return await PATCH(`${ENDPOINT.WAREHOUSE}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.WAREHOUSE}/${id}`);
}