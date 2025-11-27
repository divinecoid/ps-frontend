import { BaseApiCallIndexProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { User } from "@/interfaces/user";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.USER, { page, per_page, search });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(`${ENDPOINT.USER}/master`, { page, per_page, search });
}

export const store = async (values: User) => {
    return await POST(ENDPOINT.USER, values);
}

export const update = async (id: number, values: User) => {
    return await PATCH(`${ENDPOINT.USER}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.USER}/${id}`);
}

export const restore = async (id: number) => {
    return await POST(`${ENDPOINT.USER}/${id}/restore`);
}

export const destroy = async (id: number) => {
    return await DELETE(`${ENDPOINT.USER}/${id}`);
}