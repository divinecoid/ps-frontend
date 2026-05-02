import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallMultiDeleteProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { SmallInventory } from "@/interfaces/inventory-small";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.SMALLINVENTORY, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.SMALLINVENTORY}/master`, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<SmallInventory> = async (values) => {
    return await POST(ENDPOINT.SMALLINVENTORY, values);
}

export const update: BaseApiCallUpdateProps<SmallInventory> = async (id, values) => {
    return await PATCH(`${ENDPOINT.SMALLINVENTORY}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.SMALLINVENTORY}/${id}`);
}

export const restore: BaseApiCallRestoreProps = async (id) => {
    return await POST(`${ENDPOINT.SMALLINVENTORY}/${id}/restore`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.SMALLINVENTORY}/${id}`);
}

export const multiDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
    return await DELETE(`${ENDPOINT.SMALLINVENTORY}`, ids)
}