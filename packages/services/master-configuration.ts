import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallMultiDeleteProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Configuration } from "@/interfaces/configuration";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.CONFIGURATION, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.CONFIGURATION}/master`, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<Configuration> = async (values) => {
    return await POST(ENDPOINT.CONFIGURATION, values);
}

export const update: BaseApiCallUpdateProps<Configuration> = async (id, values) => {
    return await PATCH(`${ENDPOINT.CONFIGURATION}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.CONFIGURATION}/${id}`);
}

export const restore: BaseApiCallRestoreProps = async (id) => {
    return await POST(`${ENDPOINT.CONFIGURATION}/${id}/restore`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.CONFIGURATION}/${id}`);
}

export const multiDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
    return await DELETE(`${ENDPOINT.CONFIGURATION}`, ids)
}

export const histories = async (id: string, page?: number, per_page?: number) => {
    return await GET(`${ENDPOINT.CONFIGURATION}/${id}/histories`, { page, per_page });
}
