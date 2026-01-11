import { BaseApiCallCreateProps, BaseApiCallDeleteProps, BaseApiCallIndexProps, BaseApiCallRestoreProps, BaseApiCallUpdateProps, BaseApiCallViewProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { User } from "@/interfaces/user";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.USER, { page, per_page, search });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(`${ENDPOINT.USER}/master`, { page, per_page, search });
}

export const store: BaseApiCallCreateProps<User> = async (values) => {
    return await POST(ENDPOINT.USER, values);
}

export const update: BaseApiCallUpdateProps<User> = async (id, values) => {
    return await PATCH(`${ENDPOINT.USER}/${id}`, values);
}

export const show: BaseApiCallViewProps = async (id) => {
    return await GET(`${ENDPOINT.USER}/${id}`);
}

export const restore: BaseApiCallRestoreProps = async (id) => {
    return await POST(`${ENDPOINT.USER}/${id}/restore`);
}

export const destroy: BaseApiCallDeleteProps = async (id) => {
    return await DELETE(`${ENDPOINT.USER}/${id}`);
}