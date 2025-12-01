import { BaseApiCallIndexProps } from "@/interfaces/base";
import { DELETE, GET, PATCH, POST } from "./api"
import { Role } from "@/interfaces/role";
import { ENDPOINT } from "./endpoints";

export const index: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(ENDPOINT.ROLE, { page, per_page, search });
}

export const master: BaseApiCallIndexProps = async (page, per_page, search) => {
    return await GET(`${ENDPOINT.ROLE}/master`, { page, per_page, search });
}

export const store = async (values: Role) => {
    return await POST(ENDPOINT.ROLE, values);
}

export const update = async (id: number, values: Role) => {
    return await PATCH(`${ENDPOINT.ROLE}/${id}`, values);
}

export const show = async (id: number) => {
    return await GET(`${ENDPOINT.ROLE}/${id}`);
}

export const restore = async (id: number) => {
    return await POST(`${ENDPOINT.ROLE}/${id}/restore`);
}

export const destroy = async (id: number) => {
    return await DELETE(`${ENDPOINT.ROLE}/${id}`);
}