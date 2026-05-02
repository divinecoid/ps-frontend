import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallMultiDeleteProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Rack } from "@/interfaces/rack";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.RACK, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.RACK}/master`, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<Rack> = async (values) => {
    return await POST(ENDPOINT.RACK, values);
}

export const update: BaseApiCallUpdateProps<Rack> = async (id, values) => {
    return await PATCH(`${ENDPOINT.RACK}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.RACK}/${id}`);
}

export const restore: BaseApiCallRestoreProps = async (id) => {
    return await POST(`${ENDPOINT.RACK}/${id}/restore`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.RACK}/${id}`);
}

export const multiDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
    return await DELETE(`${ENDPOINT.RACK}`, ids)
}