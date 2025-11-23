import { BaseApiCallIndexProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Inventory } from "@/interfaces/inventory";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.INVENTORY, { page, per_page, search });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(`${ENDPOINT.INVENTORY}/master`, { page, per_page, search });
}

export const store = async (values: Inventory) => {
    return await POST(ENDPOINT.INVENTORY, values);
}

export const update = async (id: number, values: Inventory) => {
    return await PATCH(`${ENDPOINT.INVENTORY}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.INVENTORY}/${id}`);
}

export const restore = async (id: number) => {
    return await POST(`${ENDPOINT.INVENTORY}/${id}/restore`);
}

export const destroy = async (id: number) => {
    return await DELETE(`${ENDPOINT.INVENTORY}/${id}`);
}