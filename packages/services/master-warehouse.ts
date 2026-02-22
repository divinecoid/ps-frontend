import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallMultiDeleteProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Warehouse } from "@/interfaces/warehouse";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.WAREHOUSE, {page, per_page, search, sort});
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.WAREHOUSE}/master`, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<Warehouse> = async (values) => {
    return await POST(ENDPOINT.WAREHOUSE, values);
}

export const update: BaseApiCallUpdateProps<Warehouse> = async (id, values) => {
    return await PATCH(`${ENDPOINT.WAREHOUSE}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.WAREHOUSE}/${id}`);
}

export const restore: BaseApiCallRestoreProps = async (id) => {
    return await POST(`${ENDPOINT.WAREHOUSE}/${id}/restore`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.WAREHOUSE}/${id}`);
}

export const multiDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
    return await DELETE(`${ENDPOINT.WAREHOUSE}`, ids)
}