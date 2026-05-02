import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallMultiDeleteProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { LargeInventory } from "@/interfaces/inventory-large";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.LARGEINVENTORY, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.LARGEINVENTORY}/master`, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<LargeInventory> = async (values) => {
    return await POST(ENDPOINT.LARGEINVENTORY, values);
}

export const update: BaseApiCallUpdateProps<LargeInventory> = async (id, values) => {
    return await PATCH(`${ENDPOINT.LARGEINVENTORY}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.LARGEINVENTORY}/${id}`);
}

export const restore: BaseApiCallRestoreProps = async (id) => {
    return await POST(`${ENDPOINT.LARGEINVENTORY}/${id}/restore`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.LARGEINVENTORY}/${id}`);
}

export const multiDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
    return await DELETE(`${ENDPOINT.LARGEINVENTORY}`, ids)
}