import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallMultiDeleteProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Role } from "@/interfaces/role";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(ENDPOINT.ROLE, { page, per_page, search, sort });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search, sort) => {
    return await GET(`${ENDPOINT.ROLE}/master`, { page, per_page, search, sort });
}

export const store: BaseApiCallCreateProps<Role> = async (values) => {
    return await POST(ENDPOINT.ROLE, values);
}

export const update: BaseApiCallUpdateProps<Role> = async (id, values) => {
    return await PATCH(`${ENDPOINT.ROLE}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.ROLE}/${id}`);
}

export const restore: BaseApiCallRestoreProps = async (id) => {
    return await POST(`${ENDPOINT.ROLE}/${id}/restore`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.ROLE}/${id}`);
}

export const multiDestroy: BaseApiCallMultiDeleteProps = async (ids) => {
    return await DELETE(`${ENDPOINT.ROLE}`, ids)
}