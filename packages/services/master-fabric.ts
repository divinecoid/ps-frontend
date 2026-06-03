import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallMultiDeleteProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Fabric } from "@/interfaces/fabric";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.FABRIC, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.FABRIC}/master`, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<Fabric> = async (values) => {
    return await POST(ENDPOINT.FABRIC, values);
}

export const update: BaseApiCallUpdateProps<Fabric> = async (id, values) => {
    return await PATCH(`${ENDPOINT.FABRIC}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.FABRIC}/${id}`);
}

export const restore: BaseApiCallRestoreProps = async (id) => {
    return await POST(`${ENDPOINT.FABRIC}/${id}/restore`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.FABRIC}/${id}`);
}

export const multiDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
    return await DELETE(`${ENDPOINT.FABRIC}`, ids)
}

export const forceDestroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.FABRIC}/${id}/force`);
}

export const multiForceDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
    return await DELETE(`${ENDPOINT.FABRIC}/force`, ids)
}